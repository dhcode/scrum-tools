import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionView } from './session-view';
import { ActivatedRoute } from '@angular/router';
import { EstimationService, SessionInfo } from '../services/estimation.service';
import { PingSessionMemberGQL } from '../../../generated/graphql';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-session-member-view',
  templateUrl: './session-member-view.component.html',
  styleUrls: ['./session-member-view.component.scss'],
})
export class SessionMemberViewComponent extends SessionView implements OnInit, OnDestroy {
  timerSub: Subscription;

  constructor(route: ActivatedRoute, estimationService: EstimationService, private ping: PingSessionMemberGQL) {
    super(route, estimationService);
  }

  ngOnInit(): void {
    this.route.params.subscribe(({ sessionId, joinSecret }) => {
      this.sessionId = sessionId;
      if (sessionId) {
        const knownSession = this.estimationService.getKnownSession(this.sessionId);
        if (!knownSession) {
          this.estimationService.addKnownSession({
            id: sessionId,
            joinSecret,
          });
        } else {
          this.setupPingTimer(knownSession);
        }
        this.loadSession();
      }
    });
  }

  setupPingTimer(info: SessionInfo) {
    this.timerSub?.unsubscribe?.();
    if (info.memberId && info.secret) {
      this.timerSub = timer(0, 10000)
        .pipe(switchMap(() => this.ping.mutate({ id: info.id, memberId: info.memberId, secret: info.secret })))
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.timerSub?.unsubscribe?.();
  }
}
