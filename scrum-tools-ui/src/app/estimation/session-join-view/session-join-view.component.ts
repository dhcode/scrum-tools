import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JoinSessionGQL } from '../../../generated/graphql';
import { EstimationService } from '../services/estimation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingState, trackLoading } from '../../shared/loading.util';

@Component({
  selector: 'app-session-join-view',
  templateUrl: './session-join-view.component.html',
  styleUrls: ['./session-join-view.component.scss'],
})
export class SessionJoinViewComponent implements OnInit {
  name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
  sessionId = new FormControl('', [Validators.required, Validators.maxLength(10)]);
  joinSecret = new FormControl('', [Validators.maxLength(20)]);
  form = new FormGroup({ name: this.name, sessionId: this.sessionId, joinSecret: this.joinSecret });

  loadingState = new LoadingState();

  constructor(
    private estimationService: EstimationService,
    private route: ActivatedRoute,
    private joinSessionGQL: JoinSessionGQL,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const savedName = this.estimationService.getMemberName();
    if (savedName) {
      this.name.patchValue(savedName);
    }
    this.route.queryParams.subscribe((qp) => {
      if (qp.sessionId) {
        this.sessionId.patchValue(qp.sessionId);
      }
      if (qp.joinSecret) {
        this.joinSecret.patchValue(qp.joinSecret);
      }
      if (qp.name) {
        this.name.patchValue(qp.name);
      }
    });
  }

  joinSession() {
    const vars = { id: this.sessionId.value, joinSecret: this.joinSecret.value, name: this.name.value };
    this.estimationService.setMemberName(vars.name);
    this.joinSessionGQL
      .mutate(vars)
      .pipe(trackLoading(this.loadingState))
      .subscribe((result) => {
        this.estimationService.addKnownSession({
          id: vars.id,
          joinSecret: vars.joinSecret,
          memberId: result.data.joinSession.id,
          secret: result.data.joinSession.secret,
        });
        this.router.navigate(['e', vars.id, vars.joinSecret]);
      });
  }
}
