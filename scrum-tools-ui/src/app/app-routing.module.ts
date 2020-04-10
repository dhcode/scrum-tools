import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'e',
    loadChildren: () => import('./estimation/estimation.module').then((m) => m.EstimationModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'e',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
