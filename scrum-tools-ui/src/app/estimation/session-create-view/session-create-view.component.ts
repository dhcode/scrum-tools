import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateSessionGQL } from '../../../generated/graphql';
import { EstimationService } from '../services/estimation.service';

@Component({
  selector: 'app-session-create-view',
  templateUrl: './session-create-view.component.html',
  styleUrls: ['./session-create-view.component.scss'],
})
export class SessionCreateViewComponent implements OnInit {
  name = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]);
  form = new FormGroup({ name: this.name });

  constructor(private createSessionGql: CreateSessionGQL, private estimationService: EstimationService) {}

  ngOnInit(): void {}

  createSession() {
    this.createSessionGql.mutate({ name: this.name.value }).subscribe((result) => {
      console.log('result', result);
      this.estimationService.addKnownSession(result.data.createSession);
    });
    this.form.reset();
  }
}
