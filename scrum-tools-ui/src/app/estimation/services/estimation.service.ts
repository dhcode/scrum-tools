import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Apollo } from 'apollo-angular';
import { EstimationSession } from '../../../generated/graphql';
import { BehaviorSubject } from 'rxjs';

export type SessionInfo = Pick<EstimationSession, 'id' | 'joinSecret' | 'adminSecret'>;

const knownSessionsKey = 'knownSessions';

@Injectable({
  providedIn: 'root',
})
export class EstimationService {
  knownSessions$ = new BehaviorSubject<SessionInfo[]>([]);

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
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
}
