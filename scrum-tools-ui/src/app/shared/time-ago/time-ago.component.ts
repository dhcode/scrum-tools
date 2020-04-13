import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-time-ago',
  templateUrl: './time-ago.component.html',
})
export class TimeAgoComponent implements OnInit, OnDestroy {
  @Input() date: Date | string;

  output = '-';

  private sub: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.sub = timer(0, 5000).subscribe(() => {
      this.output = this.getOutput();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getOutput() {
    if (!this.date) {
      return '-';
    }
    const time = this.date instanceof Date ? this.date : new Date(this.date);
    return formatDistanceToNow(time, { addSuffix: true, includeSeconds: true });
  }
}
