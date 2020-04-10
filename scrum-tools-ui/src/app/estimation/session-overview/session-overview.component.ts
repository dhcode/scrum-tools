import { Component, OnInit } from '@angular/core';
import { EstimationSession, EstimationTopic } from 'scrum-tools-api/estimate/estimation-models';
import { subDays } from 'date-fns';
import { EstimationService } from '../services/estimation.service';

@Component({
  selector: 'app-session-overview',
  templateUrl: './session-overview.component.html',
  styleUrls: ['./session-overview.component.scss'],
})
export class SessionOverviewComponent implements OnInit {
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

  constructor(private estimationService: EstimationService) {}

  ngOnInit(): void {}
}
