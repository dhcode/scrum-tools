import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstimationService } from '../services/estimation.service';
import { SessionView } from '../session-member-view/session-view';

@Component({
  selector: 'app-session-master-view',
  templateUrl: './session-master-view.component.html',
  styleUrls: ['./session-master-view.component.scss'],
})
export class SessionMasterViewComponent extends SessionView implements OnInit, OnDestroy {
  constructor(route: ActivatedRoute, estimationService: EstimationService) {
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
}
