import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingState, trackLoading } from '../../../shared/loading.util';
import { JoinSessionGQL, SessionDetailsFragment } from '../../../../generated/graphql';
import { EstimationService } from '../../services/estimation.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-join-form',
  templateUrl: './join-form.component.html',
  styleUrls: ['./join-form.component.scss'],
})
export class JoinFormComponent implements OnInit {
  @Input() session: SessionDetailsFragment;
  @Output() joined = new EventEmitter();

  name = new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
  form = new UntypedFormGroup({ name: this.name });

  loadingState = new LoadingState();

  constructor(private joinSessionGQL: JoinSessionGQL, private estimationService: EstimationService) {}

  ngOnInit(): void {}

  joinSession() {
    const vars = { id: this.session.id, joinSecret: this.session.joinSecret, name: this.name.value };
    this.estimationService.setMemberName(vars.name);
    this.joinSessionGQL
      .mutate(vars)
      .pipe(trackLoading(this.loadingState))
      .subscribe((result) => {
        this.estimationService.addKnownSession({
          id: this.session.id,
          joinSecret: this.session.joinSecret,
          memberId: result.data.joinSession.id,
          secret: result.data.joinSession.secret,
        });
        this.joined.emit();
      });
  }
}
