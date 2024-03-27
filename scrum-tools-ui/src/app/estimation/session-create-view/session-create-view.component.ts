import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CreateSessionGQL } from '../../../generated/graphql';
import { EstimationService } from '../services/estimation.service';
import { Router } from '@angular/router';
import { LoadingState, trackLoading } from '../../shared/loading.util';

@Component({
  selector: 'app-session-create-view',
  templateUrl: './session-create-view.component.html',
  styleUrls: ['./session-create-view.component.scss'],
})
export class SessionCreateViewComponent implements OnInit {
  name = new UntypedFormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]);
  form = new UntypedFormGroup({ name: this.name });

  loadingState = new LoadingState();

  constructor(
    private createSessionGql: CreateSessionGQL,
    private estimationService: EstimationService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  createSession() {
    this.createSessionGql
      .mutate({ name: this.name.value })
      .pipe(trackLoading(this.loadingState))
      .subscribe((result) => {
        console.log('result', result);
        const session = result.data.createSession;
        this.estimationService.addKnownSession(session);
        this.router.navigate(['e', 'master', session.id]);
      });
    this.form.reset();
  }
}
