import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EstimationViewComponent } from './estimation-view/estimation-view.component';
import { EstimationSessionsViewComponent } from './estimation-sessions-view/estimation-sessions-view.component';

@NgModule({
  declarations: [AppComponent, EstimationViewComponent, EstimationSessionsViewComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
