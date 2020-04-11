import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { TimeAgoComponent } from './time-ago/time-ago.component';
import { FormErrorsComponent } from './form-errors/form-errors.component';
import { FormErrorMsgDirective } from './form-errors/form-error-msg.directive';
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    LoadingSpinnerComponent,
    TimeAgoComponent,
    FormErrorsComponent,
    FormErrorMsgDirective,
    ErrorMessageComponent,
  ],
  exports: [
    LoadingSpinnerComponent,
    TimeAgoComponent,
    FormErrorsComponent,
    FormErrorMsgDirective,
    ErrorMessageComponent,
  ],
})
export class SharedModule {}
