import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionDetailMember, SessionDetailTopicVote } from '../../services/estimation.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {
  @Input() member: SessionDetailMember;
  @Input() isAdmin: boolean;
  @Input() vote: SessionDetailTopicVote;
  @Input() isDetailed = false;
  @Output() isDetailedChange = new EventEmitter<boolean>();
  @Output() remove = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  toggleEdit() {
    this.isDetailedChange.next(!this.isDetailed);
  }
}
