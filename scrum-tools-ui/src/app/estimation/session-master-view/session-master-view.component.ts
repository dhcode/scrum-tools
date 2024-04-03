import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstimationService } from '../services/estimation.service';
import { SessionView } from '../session-member-view/session-view';
import { EndVoteGQL, RemoveMemberGQL, SessionDetailsFragment, SessionMemberFragment } from '../../../generated/graphql';
import { trackLoading } from '../../shared/loading.util';
import QRCode from 'qrcode';
import { combineLatest } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-session-master-view',
  templateUrl: './session-master-view.component.html',
  styleUrls: ['./session-master-view.component.scss'],
})
export class SessionMasterViewComponent extends SessionView implements OnInit, OnDestroy {
  joinLink: string;
  qrCode: string;

  constructor(
    route: ActivatedRoute,
    estimationService: EstimationService,
    private removeMemberGQL: RemoveMemberGQL,
    private endVoteGQL: EndVoteGQL,
    private clipboard: Clipboard,
  ) {
    super(route, estimationService);
  }

  ngOnInit(): void {
    combineLatest([this.route.params, this.route.queryParams]).subscribe(([{ sessionId }, queryParams]) => {
      this.sessionId = sessionId;
      if (sessionId && queryParams.joinSecret && queryParams.adminSecret) {
        this.estimationService.addKnownSession({
          id: sessionId,
          joinSecret: queryParams.joinSecret,
          adminSecret: queryParams.adminSecret,
        });
      }
      this.loadSession();
    });
  }

  onSessionUpdated(session: SessionDetailsFragment) {
    const joinLink = `${location.protocol}//${location.host}/e/${session.id}/${session.joinSecret}`;
    if (joinLink !== this.joinLink) {
      this.joinLink = joinLink;
      QRCode.toDataURL(this.joinLink).then((url) => (this.qrCode = url));
    }
  }

  removeMember(member: SessionMemberFragment) {
    this.removeMemberGQL
      .mutate({ id: this.sessionId, adminSecret: this.session.adminSecret, memberId: member.id })
      .pipe(trackLoading(this.loadingState))
      .subscribe();
  }

  endVote() {
    this.endVoteGQL
      .mutate({ id: this.sessionId, adminSecret: this.session.adminSecret, topicId: this.session.activeTopic.id })
      .pipe(trackLoading(this.loadingState))
      .subscribe();
  }

  copyMemberUrl() {
    this.clipboard.copy(this.joinLink);
  }

  copyMasterUrl() {
    const { id, joinSecret, adminSecret } = this.session;
    this.clipboard.copy(
      `${location.protocol}//${location.host}/e/master/${id}?joinSecret=${joinSecret}&adminSecret=${adminSecret}`,
    );
  }
}
