import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionMemberViewComponent } from './session-member-view/session-member-view.component';
import { SessionMasterViewComponent } from './session-master-view/session-master-view.component';
import { SessionJoinViewComponent } from './session-join-view/session-join-view.component';
import { SessionOverviewComponent } from './session-overview/session-overview.component';
import { SessionCreateViewComponent } from './session-create-view/session-create-view.component';

const routes: Routes = [
  { path: 'master/new', component: SessionCreateViewComponent },
  { path: 'master/:sessionId', component: SessionMasterViewComponent },
  { path: ':sessionId/:joinSecret', component: SessionMemberViewComponent },
  { path: 'join', component: SessionJoinViewComponent },
  { path: '', component: SessionOverviewComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstimationRoutingModule {}
