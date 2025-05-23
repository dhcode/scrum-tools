import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  loadingState = new LoadingState();

  defaultOptionsSets = [
    { name: '1, 2, 3, 5, 8, 13, 20, 40, ?', options: [1, 2, 3, 5, 8, 13, 20, 40, 0] },
    { name: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ?', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0] },
    { name: '1, 2, 3, 4, 5, 10, 15, 20, 30, 40, ?', options: [1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 0] },
  ];

  name = new UntypedFormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]);
  optionSet = new FormControl(this.defaultOptionsSets[0]);
  form = new UntypedFormGroup({ name: this.name, optionSet: this.optionSet });

  constructor(
    private createSessionGql: CreateSessionGQL,
    private estimationService: EstimationService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  createSession() {
    this.createSessionGql
      .mutate({ name: this.name.value, defaultOptions: this.optionSet.value.options })
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
