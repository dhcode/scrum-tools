import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstimationViewComponent } from './estimation-view/estimation-view.component';
import { EstimationSessionsViewComponent } from './estimation-sessions-view/estimation-sessions-view.component';

const routes: Routes = [
  {
    path: 'estimation/:sessionId',
    component: EstimationViewComponent,
  },
  {
    path: 'estimation',
    component: EstimationSessionsViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
