import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingState, trackLoading } from '../../../shared/loading.util';
import { CreateTopicGQL, SessionDetailsFragment, UpdateSessionGQL } from '../../../../generated/graphql';
import { concat } from 'rxjs';

@Component({
  selector: 'app-create-topic-form',
  templateUrl: './create-topic-form.component.html',
  styleUrls: ['./create-topic-form.component.scss'],
})
export class CreateTopicFormComponent implements OnInit, OnChanges {
  @Input() session: SessionDetailsFragment;
  @Output() joined = new EventEmitter();

  name = new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  description = new UntypedFormControl('', [Validators.maxLength(2000)]);
  options = new UntypedFormControl();
  form = new UntypedFormGroup({ name: this.name, description: this.description, options: this.options });

  loadingState = new LoadingState();

  constructor(private createTopicGQL: CreateTopicGQL, private updateSessionGQL: UpdateSessionGQL) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('session' in changes) {
      this.options.patchValue(this.session.defaultOptions);
    }
  }

  createTopic() {
    const ops = [];
    if (JSON.stringify(this.options.value) !== JSON.stringify(this.session.defaultOptions)) {
      ops.push(
        this.updateSessionGQL.mutate({
          id: this.session.id,
          adminSecret: this.session.adminSecret,
          defaultOptions: this.options.value,
        }),
      );
    }

    ops.push(
      this.createTopicGQL.mutate({ id: this.session.id, adminSecret: this.session.adminSecret, name: this.name.value }),
    );

    concat(...ops)
      .pipe(trackLoading(this.loadingState))
      .subscribe();
  }
}
