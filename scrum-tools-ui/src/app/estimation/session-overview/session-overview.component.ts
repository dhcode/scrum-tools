import { Component, OnDestroy, OnInit } from '@angular/core';
import { subDays } from 'date-fns';
import { EstimationService } from '../services/estimation.service';
import { EstimationSession, EstimationTopic } from '../../../generated/graphql';
import { Subscription } from 'rxjs';
import { LoadingState, trackLoading } from '../../shared/loading.util';

@Component({
  selector: 'app-session-overview',
  templateUrl: './session-overview.component.html',
  styleUrls: ['./session-overview.component.scss'],
})
export class SessionOverviewComponent implements OnInit, OnDestroy {
  sessions: Partial<EstimationSession>[] = [
    {
      id: 'a',
      name: 'Hello',
      joinSecret: 'sec1',
      adminSecret: 'hey',
      members: [],
      activeTopic: {} as EstimationTopic,
      modifiedAt: new Date(),
    },
    {
      id: 'b',
      name: 'Hello 2',
      joinSecret: 'sec2',
      adminSecret: null,
      members: [],
      activeTopic: null,
      modifiedAt: subDays(new Date(), 4),
    },
  ];

  loadingState = new LoadingState();

  private sub: Subscription;

  constructor(private estimationService: EstimationService) {}

  ngOnInit(): void {
    this.sub = this.estimationService
      .getSessionsOverview()
      .pipe(trackLoading(this.loadingState))
      .subscribe((sessions) => {
        console.log('got sessions', sessions);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
