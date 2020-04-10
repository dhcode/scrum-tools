import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appFormErrorMsg]',
})
export class FormErrorMsgDirective {
  @Input('appFormErrorMsg') error;
  constructor(public tpl: TemplateRef<any>) {}
}
