import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionDetailsFragment, SessionMemberFragment } from '../../../generated/graphql';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent {
  @Input() session: SessionDetailsFragment;
  isDetailed = false;

  @Output() remove = new EventEmitter<SessionMemberFragment>();

  constructor() {}
  get isAdmin(): boolean {
    return !!this.session.adminSecret;
  }

  get onlineMembers(): number {
    const now = new Date().getTime();
    return this.session.members.filter((m) => new Date(m.lastSeenAt).getTime() > now - 10000).length;
  }

  byId(member: SessionMemberFragment) {
    return member.id;
  }
}
