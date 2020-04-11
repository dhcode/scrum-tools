import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {
  EstimationSession,
  EstimationSessionOverviewGQL,
  EstimationSessionOverviewQuery,
} from '../../../generated/graphql';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export type SessionInfo = Pick<EstimationSession, 'id' | 'joinSecret' | 'adminSecret'>;
export type SessionOverview = EstimationSessionOverviewQuery['estimationSession'];

const knownSessionsKey = 'knownSessions';

@Injectable({
  providedIn: 'root',
})
export class EstimationService {
  knownSessions$ = new BehaviorSubject<SessionInfo[]>([]);

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private sessionOverviewGQL: EstimationSessionOverviewGQL,
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

  watchSessionForOverview(info: SessionInfo): Observable<SessionOverview> {
    return this.sessionOverviewGQL.watch(info).valueChanges.pipe(map((data) => data.data.estimationSession));
  }

  getSessionsOverview(): Observable<SessionOverview[]> {
    return this.knownSessions$.pipe(
      switchMap((sessionInfos) => combineLatest(sessionInfos.map((info) => this.watchSessionForOverview(info)))),
    );
  }
}
