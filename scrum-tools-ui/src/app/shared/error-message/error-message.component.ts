import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { extractGraphQLError } from '../error-handling.util';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent implements OnChanges {
  message = '';
  code = '';

  @Input() error: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.error) {
      this.identifyError();
    }
  }

  identifyError() {
    if (this.error === undefined || this.error === null) {
      this.message = '';
      this.code = '';
    } else if (this.error && this.error.graphQLErrors) {
      const info = extractGraphQLError(this.error);
      this.message = info.message;
      this.code = info.code;
    } else if (this.error && this.error.code) {
      this.code = this.error.code;
      this.message = this.error.message;
    } else {
      this.code = '';
      this.message = this.error.toString();
    }
  }
}
