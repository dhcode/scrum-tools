import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionView } from './session-view';
import { ActivatedRoute } from '@angular/router';
import { EstimationService, SessionDetails, SessionInfo } from '../services/estimation.service';
import { PingSessionMemberGQL } from '../../../generated/graphql';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-session-member-view',
  templateUrl: './session-member-view.component.html',
  styleUrls: ['./session-member-view.component.scss'],
})
export class SessionMemberViewComponent extends SessionView implements OnInit, OnDestroy {
  timerSub: Subscription;
  memberId: string = null;

  memberName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);

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
        }
        this.loadSession();
      }
    });
    const savedName = this.estimationService.getMemberName();
    if (savedName) {
      this.memberName.patchValue(this.estimationService.getMemberName());
    }
  }

  onSessionUpdated(session: SessionDetails) {
    this.initMember();
  }

  initMember() {
    const knownSession = this.estimationService.getKnownSession(this.sessionId);
    const foundMember = this.session.members.find((m) => m.id === knownSession.memberId);
    if (foundMember && this.memberId !== knownSession.memberId) {
      this.memberId = knownSession.memberId;
      this.setupPingTimer(knownSession);
    } else if (!foundMember) {
      this.memberId = null;
    }
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
