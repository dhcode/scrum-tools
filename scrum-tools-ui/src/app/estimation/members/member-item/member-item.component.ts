import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionMemberFragment } from '../../../../generated/graphql';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {
  @Input() member: SessionMemberFragment;
  @Input() isAdmin: boolean;
  @Input() isDetailed = false;
  @Output() isDetailedChange = new EventEmitter<boolean>();
  @Output() remove = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  toggleEdit() {
    this.isDetailedChange.next(!this.isDetailed);
  }
}
