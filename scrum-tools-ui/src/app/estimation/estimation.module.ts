import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstimationRoutingModule } from './estimation-routing.module';
import { SessionOverviewComponent } from './session-overview/session-overview.component';
import { SessionMasterViewComponent } from './session-master-view/session-master-view.component';
import { SessionMemberViewComponent } from './session-member-view/session-member-view.component';
import { SessionJoinViewComponent } from './session-join-view/session-join-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionCreateViewComponent } from './session-create-view/session-create-view.component';
import { SharedModule } from '../shared/shared.module';
import { MembersComponent } from './members/members.component';
import { OnlineStatusPipe } from './members/online-status.pipe';
import { JoinFormComponent } from './session-member-view/join-form/join-form.component';
import { MemberItemComponent } from './members/member-item/member-item.component';
import { CreateTopicFormComponent } from './session-master-view/create-topic-form/create-topic-form.component';
import { TopicResultComponent } from './topic-result/topic-result.component';
import { OptionsInputComponent } from './session-master-view/create-topic-form/options-input/options-input.component';

@NgModule({
  declarations: [
    SessionOverviewComponent,
    SessionMasterViewComponent,
    SessionMemberViewComponent,
    SessionJoinViewComponent,
    SessionCreateViewComponent,
    MembersComponent,
    OnlineStatusPipe,
    JoinFormComponent,
    MemberItemComponent,
    CreateTopicFormComponent,
    TopicResultComponent,
    OptionsInputComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, EstimationRoutingModule, SharedModule],
})
export class EstimationModule {}
