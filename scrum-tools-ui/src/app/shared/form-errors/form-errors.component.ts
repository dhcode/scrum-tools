import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  DoCheck,
  Input,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormErrorMsgDirective } from './form-error-msg.directive';

interface ErrorInfo {
  tpl: TemplateRef<any>;
  ctx: Record<string, any>;
}

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
})
export class FormErrorsComponent implements DoCheck, AfterViewInit {
  errorMessages: Record<string, TemplateRef<any>> = {};

  messageTemplates: ErrorInfo[] = [];

  private lastValue = null;

  @Input() control: FormControl;

  @ViewChildren(FormErrorMsgDirective) defaultMsgTemplates: QueryList<FormErrorMsgDirective>;
  @ContentChildren(FormErrorMsgDirective) msgTemplates: QueryList<FormErrorMsgDirective>;

  ngDoCheck(): void {
    if (this.control && this.control.touched) {
      this.checkValue();
    } else if (this.messageTemplates.length) {
      this.messageTemplates = [];
    }
  }

  ngAfterViewInit(): void {
    this.defaultMsgTemplates.forEach((item) => {
      if (item.error) {
        this.errorMessages[item.error] = item.tpl;
      }
    });
    this.msgTemplates.forEach((item) => {
      if (item.error) {
        this.errorMessages[item.error] = item.tpl;
      }
    });
  }

  checkValue() {
    const value = this.control.value;
    if (value !== this.lastValue) {
      this.lastValue = value;
      this.updateMessages();
    }
  }

  updateMessages() {
    this.messageTemplates = [];
    for (const [err, tpl] of Object.entries(this.errorMessages)) {
      if (this.control.hasError(err)) {
        const errInfo = this.control.getError(err);
        console.log('errInfo', errInfo);
        this.messageTemplates.push({
          ctx: { $implicit: errInfo },
          tpl: tpl,
        });
      }
    }
  }
}
