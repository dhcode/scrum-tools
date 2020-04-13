import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionDetails } from '../../services/estimation.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingState, trackLoading } from '../../../shared/loading.util';
import { CreateTopicGQL } from '../../../../generated/graphql';

@Component({
  selector: 'app-create-topic-form',
  templateUrl: './create-topic-form.component.html',
  styleUrls: ['./create-topic-form.component.scss'],
})
export class CreateTopicFormComponent implements OnInit {
  @Input() session: SessionDetails;
  @Output() joined = new EventEmitter();

  name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
  form = new FormGroup({ name: this.name });

  loadingState = new LoadingState();

  constructor(private createTopicGQL: CreateTopicGQL) {}

  ngOnInit(): void {}

  createTopic() {
    this.createTopicGQL
      .mutate({ id: this.session.id, adminSecret: this.session.adminSecret, name: this.name.value })
      .pipe(trackLoading(this.loadingState))
      .subscribe();
  }
}
