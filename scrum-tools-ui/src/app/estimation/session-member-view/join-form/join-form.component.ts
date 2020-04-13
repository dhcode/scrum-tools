import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { LoadingState, trackLoading } from '../../../shared/loading.util';
import { JoinSessionGQL } from '../../../../generated/graphql';
import { EstimationService, SessionDetails } from '../../services/estimation.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-join-form',
  templateUrl: './join-form.component.html',
  styleUrls: ['./join-form.component.scss'],
})
export class JoinFormComponent implements OnInit {
  @Input() session: SessionDetails;
  @Output() joined = new EventEmitter();

  name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
  form = new FormGroup({ name: this.name });

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
