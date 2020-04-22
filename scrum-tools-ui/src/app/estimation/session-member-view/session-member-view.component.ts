import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionView } from './session-view';
import { ActivatedRoute } from '@angular/router';
import { EstimationService, SessionInfo } from '../services/estimation.service';
import { AddVoteGQL, LeaveSessionGQL, PingSessionMemberGQL, SessionDetailsFragment } from '../../../generated/graphql';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { LoadingState, trackLoading } from '../../shared/loading.util';

@Component({
  selector: 'app-session-member-view',
  templateUrl: './session-member-view.component.html',
  styleUrls: ['./session-member-view.component.scss'],
})
export class SessionMemberViewComponent extends SessionView implements OnInit, OnDestroy {
  timerSub: Subscription;
  memberId: string = null;
  memberSecret: string = null;

  memberName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);

  voteLoadingState = new LoadingState();

  vote: number;

  constructor(
    route: ActivatedRoute,
    estimationService: EstimationService,
    private ping: PingSessionMemberGQL,
    private addVoteGQL: AddVoteGQL,
    private leaveSessionGQL: LeaveSessionGQL,
  ) {
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

  onSessionUpdated(session: SessionDetailsFragment) {
    this.initMember();
  }

  initMember() {
    const knownSession = this.estimationService.getKnownSession(this.sessionId);
    const foundMember = this.session.members.find((m) => m.id === knownSession.memberId);
    if (foundMember && this.memberId !== knownSession.memberId) {
      this.memberId = knownSession.memberId;
      this.memberSecret = knownSession.secret;
      this.setupPingTimer(knownSession);
    } else if (!foundMember) {
      this.memberId = null;
      this.memberSecret = null;
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

  addVote(vote: number) {
    this.addVoteGQL
      .mutate({ id: this.sessionId, memberId: this.memberId, secret: this.memberSecret, vote: vote })
      .pipe(trackLoading(this.voteLoadingState))
      .subscribe(() => {
        this.vote = vote;
      });
  }

  leaveSession() {
    this.leaveSessionGQL
      .mutate({ id: this.sessionId, memberId: this.memberId, secret: this.memberSecret })
      .pipe(trackLoading(this.loadingState))
      .subscribe(() => {
        this.memberId = null;
        this.memberSecret = null;
      });
  }
}
