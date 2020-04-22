import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingState, trackLoading } from '../../../shared/loading.util';
import { CreateTopicGQL, SessionDetailsFragment } from '../../../../generated/graphql';

@Component({
  selector: 'app-create-topic-form',
  templateUrl: './create-topic-form.component.html',
  styleUrls: ['./create-topic-form.component.scss'],
})
export class CreateTopicFormComponent implements OnInit {
  @Input() session: SessionDetailsFragment;
  @Output() joined = new EventEmitter();

  name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  description = new FormControl('', [Validators.maxLength(2000)]);
  form = new FormGroup({ name: this.name, description: this.description });

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
