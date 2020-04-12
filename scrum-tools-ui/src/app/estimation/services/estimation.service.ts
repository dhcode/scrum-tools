import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {
  EstimationMember,
  EstimationSessionDetailsGQL,
  EstimationSessionDetailsQuery,
  EstimationSessionOverviewGQL,
  EstimationSessionOverviewQuery,
  EstimationTopic,
  MemberAddedGQL,
  MemberRemovedGQL,
  MemberUpdatedGQL,
  SessionUpdatedGQL,
  TopicCreatedGQL,
  TopicVote,
  VoteAddedGQL,
  VoteEndedGQL,
} from '../../../generated/graphql';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subscription } from 'rxjs';
import { catchError, map, share, switchMap } from 'rxjs/operators';
import { GraphQLUiError } from '../../shared/error-handling.util';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export interface SessionInfo {
  id: string;
  joinSecret: string;
  adminSecret?: string;
  memberId?: string;
  secret?: string;
}

export type SessionOverview = EstimationSessionOverviewQuery['estimationSession'];
export type SessionDetails = EstimationSessionDetailsQuery['estimationSession'];
export type SessionDetailMember = Pick<EstimationMember, 'id' | 'lastSeenAt' | 'name'>;
export type SessionDetailTopic = Pick<
  EstimationTopic,
  'id' | 'description' | 'name' | 'startedAt' | 'endedAt' | 'options'
>;
export type SessionDetailTopicVote = Pick<TopicVote, 'memberId' | 'memberName' | 'vote' | 'votedAt'>;

const knownSessionsKey = 'knownSessions';

@Injectable({
  providedIn: 'root',
})
export class EstimationService {
  knownSessions$ = new BehaviorSubject<SessionInfo[]>([]);

  sessionOverview$ = this.knownSessions$.pipe(
    switchMap((sessionInfos) => this.watchSessionsForOverview(sessionInfos)),
    map((sessions) => sessions.filter((s) => !!s)),
    (source) => this.subscribeSessionsChanges(source),
  );

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private apollo: Apollo,
    private sessionOverviewGQL: EstimationSessionOverviewGQL,
    private sessionUpdatedGQL: SessionUpdatedGQL,
    private memberAddedGQL: MemberAddedGQL,
    private memberRemovedGQL: MemberRemovedGQL,
    private memberUpdatedGQL: MemberUpdatedGQL,
    private topicCreatedGQL: TopicCreatedGQL,
    private voteAddedGQL: VoteAddedGQL,
    private voteEndedGQL: VoteEndedGQL,
    private sessionDetailsGQL: EstimationSessionDetailsGQL,
  ) {
    this.knownSessions$.next(this.getKnownSessions());
  }

  private getKnownSessions(): SessionInfo[] {
    return this.storage.get(knownSessionsKey) || [];
  }

  getMemberName() {
    return this.storage.get('memberName');
  }
  setMemberName(name: string) {
    return this.storage.set('memberName', name);
  }

  addKnownSession(session: SessionInfo) {
    const sessions = this.getKnownSessions();
    const existing = sessions.find((s) => s.id === session.id);
    if (existing) {
      if ('joinSecret' in session) {
        existing.joinSecret = session.joinSecret;
      }
      if ('joinSecret' in session) {
        existing.adminSecret = session.adminSecret;
      }
      if ('memberId' in session) {
        existing.memberId = session.memberId;
      }
      if ('memberId' in session) {
        existing.secret = session.secret;
      }
      this.storage.set(knownSessionsKey, sessions);
      this.knownSessions$.next(sessions);
    } else if (!existing) {
      sessions.push({
        id: session.id,
        joinSecret: session.joinSecret,
        adminSecret: session.adminSecret,
        memberId: session.memberId,
        secret: session.secret,
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

  getKnownSession(sessionId: string): SessionInfo {
    return this.getKnownSessions().find((s) => s.id === sessionId);
  }

  getSession(sessionInfo: SessionInfo): Observable<SessionDetails> {
    return this.sessionDetailsGQL.watch(sessionInfo).valueChanges.pipe(map((change) => change.data.estimationSession));
  }

  private watchSessionsForOverview(sessions: SessionInfo[]) {
    if (sessions.length) {
      return combineLatest(sessions.map((info) => this.watchSessionForOverview(info)));
    } else {
      return of([]);
    }
  }

  private watchSessionForOverview(info: SessionInfo): Observable<SessionOverview> {
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

  private subscribeSessionsChanges(source: Observable<SessionOverview[]>): Observable<SessionOverview[]> {
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

  subscribeSession(info: SessionInfo) {
    return merge(
      this.sessionUpdatedGQL.subscribe(info),
      this.memberAddedGQL.subscribe(info),
      this.memberRemovedGQL.subscribe(info),
    );
  }

  subscribeSessionWithDetails(info: SessionInfo) {
    return merge(
      this.subscribeSession(info),
      this.memberUpdatedGQL.subscribe(info),
      this.topicCreatedGQL.subscribe(info),
      this.voteAddedGQL.subscribe(info),
      this.voteEndedGQL.subscribe(info),
    );
  }

  private updateMembersInCache(sessionId: string, member, remove = false) {
    const cache = this.apollo.getClient();
    const id = `EstimationSession:${sessionId}`;
    const fragment = gql`
      fragment sessionMembers on EstimationSession {
        members {
          id
          name
          lastSeenAt
        }
      }
    `;
    const result = cache.readFragment({ fragment, id });
    if (!result) {
      return;
    }
    const index = result.members.findIndex((m) => m.id === member.id);
    if (!remove && index === -1) {
      result.members.push(member);
    }
    if (!remove && index !== -1) {
      result.members[index] = member;
    }
    if (remove && index !== -1) {
      result.members.splice(index, 1);
    }
    cache.writeFragment({ fragment, id, data: result });
  }
}
