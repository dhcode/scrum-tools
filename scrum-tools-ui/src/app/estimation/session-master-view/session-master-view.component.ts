import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session-master-view',
  templateUrl: './session-master-view.component.html',
  styleUrls: ['./session-master-view.component.scss'],
})
export class SessionMasterViewComponent implements OnInit {
  isNew = false;
  sessionId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ sessionId }) => {
      if (sessionId === 'new') {
        this.isNew = true;
        this.sessionId = null;
      } else {
        this.isNew = false;
        this.sessionId = sessionId;
      }
    });
  }

  initNew() {}
}
