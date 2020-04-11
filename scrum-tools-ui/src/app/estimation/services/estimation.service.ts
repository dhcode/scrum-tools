import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {
  EstimationSession,
  EstimationSessionOverviewGQL,
  EstimationSessionOverviewQuery,
  MemberAddedGQL,
  MemberRemovedGQL,
  SessionUpdatedGQL,
} from '../../../generated/graphql';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  MonoTypeOperatorFunction,
  Observable,
  of,
  OperatorFunction,
  Subscription,
} from 'rxjs';
import { catchError, map, mergeMap, share, switchMap, tap } from 'rxjs/operators';
import { GraphQLUiError } from '../../shared/error-handling.util';
import { Apollo } from 'apollo-angular';

export type SessionInfo = Pick<EstimationSession, 'id' | 'joinSecret' | 'adminSecret'>;
export type SessionOverview = EstimationSessionOverviewQuery['estimationSession'];

const knownSessionsKey = 'knownSessions';

@Injectable({
  providedIn: 'root',
})
export class EstimationService {
  knownSessions$ = new BehaviorSubject<SessionInfo[]>([]);

  sessionOverview$ = this.knownSessions$.pipe(
    switchMap((sessionInfos) => combineLatest(sessionInfos.map((info) => this.watchSessionForOverview(info)))),
    map((sessions) => sessions.filter((s) => !!s)),
    (source) => this.subscribeSessionsOnce(source),
  );

  private sessionSubs: Record<string, Subscription> = {};

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private apollo: Apollo,
    private sessionOverviewGQL: EstimationSessionOverviewGQL,
    private sessionUpdatedGQL: SessionUpdatedGQL,
    private memberAddedGQL: MemberAddedGQL,
    private memberRemovedGQL: MemberRemovedGQL,
  ) {
    this.knownSessions$.next(this.getKnownSessions());
  }

  private getKnownSessions(): SessionInfo[] {
    return this.storage.get(knownSessionsKey) || [];
  }

  addKnownSession(session: SessionInfo) {
    const sessions = this.getKnownSessions();
    const existing = sessions.find((s) => s.id === session.id);
    if (existing && existing.joinSecret !== session.joinSecret) {
      existing.joinSecret = session.joinSecret;
      this.storage.set(knownSessionsKey, sessions);
      this.knownSessions$.next(sessions);
    } else if (!existing) {
      sessions.push({
        id: session.id,
        joinSecret: session.joinSecret,
        adminSecret: session.adminSecret,
      });
      this.storage.set(knownSessionsKey, sessions);
      this.knownSessions$.next(sessions);
    }
  }

  removeKnownSession(id: string) {
    const sessions = this.getKnownSessions();
    const index = sessions.findIndex((s) => s.id === id);
    if (index !== -1) {
      sessions.splice(index, 1);
      this.storage.set(knownSessionsKey, sessions);
      this.knownSessions$.next(sessions);
    }
  }

  watchSessionForOverview(info: SessionInfo): Observable<SessionOverview> {
    return this.sessionOverviewGQL.watch(info).valueChanges.pipe(
      map((data) => data.data.estimationSession),
      catchError((err) => {
        const errInfo = new GraphQLUiError(err);
        if (errInfo.code === 'sessionNotFound') {
          this.removeKnownSession(info.id);
          return of(null);
        }
        throw errInfo;
      }),
    );
  }

  getSessionsOverview(): Observable<SessionOverview[]> {
    return this.sessionOverview$;
  }

  private subscribeSessionsOp<T = SessionOverview[]>(): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) =>
      new Observable<T>((subscriber) => {
        const sessionSubs: Record<string, Subscription> = {};

        const sub = source.subscribe(
          (v) => subscriber.next(v),
          (err) => subscriber.error(err),
          () => subscriber.complete(),
        );
        return () => {
          sub.unsubscribe();
        };
      });
  }

  private subscribeSessionsOnce(source: Observable<SessionOverview[]>): Observable<SessionOverview[]> {
    return new Observable<SessionOverview[]>((subscriber) => {
      const sessionSubs: Record<string, Subscription> = {};
      console.log('subscribeSessions subscribe');

      const sub = source.subscribe(
        (v) => {
          this.subscribeSessions(v, sessionSubs);
          subscriber.next(v);
        },
        (err) => subscriber.error(err),
        () => subscriber.complete(),
      );
      return () => {
        console.log('subscribeSessions unsubscribe');
        this.subscribeSessions([], sessionSubs);
        sub.unsubscribe();
      };
    }).pipe(share());
  }

  private subscribeSessions(sessions: SessionOverview[], sessionSubs: Record<string, Subscription>) {
    const existingIds = new Set(Object.keys(sessionSubs));
    for (const session of sessions) {
      if (existingIds.has(session.id)) {
        existingIds.delete(session.id);
      } else {
        console.log('start session sub', session.id);
        sessionSubs[session.id] = this.subscribeSession(session).subscribe();
      }
    }
    for (const id of existingIds) {
      console.log('end session sub', id);
      sessionSubs[id].unsubscribe();
      delete sessionSubs[id];
    }
  }

  private subscribeSession(info: SessionOverview) {
    return merge(
      this.sessionUpdatedGQL.subscribe(info),
      this.memberAddedGQL.subscribe(info).pipe(
        tap((data) => {
          info.members.push(data.data.memberAdded);
          this.apollo.getClient().writeData({ data: info });
        }),
      ),
      this.memberRemovedGQL.subscribe(info).pipe(
        tap((data) => {
          const index = info.members.findIndex((m) => m.id === data.data.memberRemoved.id);
          info.members.splice(index, 1);
          this.apollo.getClient().writeData({ data: info });
        }),
      ),
    );
  }
}
