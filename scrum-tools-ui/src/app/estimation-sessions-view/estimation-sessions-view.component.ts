import { Component, OnInit } from '@angular/core';
import { EstimationService } from '../services/estimation.service';

@Component({
  selector: 'app-estimation-sessions-view',
  templateUrl: './estimation-sessions-view.component.html',
  styleUrls: ['./estimation-sessions-view.component.scss'],
})
export class EstimationSessionsViewComponent implements OnInit {
  constructor(private estimationService: EstimationService) {}

  ngOnInit(): void {}

  start() {
    this.estimationService.joinSession('test1', 'ssss').subscribe((res) => {
      console.log('res', res);
    });
  }
}
