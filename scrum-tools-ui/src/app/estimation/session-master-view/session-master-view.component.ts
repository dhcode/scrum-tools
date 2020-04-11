import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session-master-view',
  templateUrl: './session-master-view.component.html',
  styleUrls: ['./session-master-view.component.scss'],
})
export class SessionMasterViewComponent implements OnInit {
  sessionId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ sessionId }) => {
      this.sessionId = sessionId;
    });
  }
}
