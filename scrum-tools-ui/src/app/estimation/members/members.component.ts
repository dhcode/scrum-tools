import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionDetailsFragment, SessionMemberFragment } from '../../../generated/graphql';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  @Input() session: SessionDetailsFragment;
  isDetailed = false;

  @Output() remove = new EventEmitter<SessionMemberFragment>();

  constructor() {}
  get isAdmin(): boolean {
    return !!this.session.adminSecret;
  }

  ngOnInit(): void {}

  byId(member: SessionMemberFragment) {
    return member.id;
  }
}
