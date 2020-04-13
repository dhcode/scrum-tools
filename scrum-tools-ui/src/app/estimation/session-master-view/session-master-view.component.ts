import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstimationService, SessionDetailMember, SessionDetails } from '../services/estimation.service';
import { SessionView } from '../session-member-view/session-view';
import { RemoveMemberGQL } from '../../../generated/graphql';
import { trackLoading } from '../../shared/loading.util';

@Component({
  selector: 'app-session-master-view',
  templateUrl: './session-master-view.component.html',
  styleUrls: ['./session-master-view.component.scss'],
})
export class SessionMasterViewComponent extends SessionView implements OnInit, OnDestroy {
  joinLink: string;

  constructor(route: ActivatedRoute, estimationService: EstimationService, private removeMemberGQL: RemoveMemberGQL) {
    super(route, estimationService);
  }

  ngOnInit(): void {
    this.route.params.subscribe(({ sessionId }) => {
      this.sessionId = sessionId;
      if (sessionId) {
        this.loadSession();
      }
    });
  }

  onSessionUpdated(session: SessionDetails) {
    this.joinLink = `${location.protocol}//${location.host}/e/${session.id}/${session.joinSecret}`;
  }

  removeMember(member: SessionDetailMember) {
    this.removeMemberGQL
      .mutate({ id: this.sessionId, adminSecret: this.session.adminSecret, memberId: member.id })
      .pipe(trackLoading(this.loadingState))
      .subscribe();
  }
}
