import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionDetailMember, SessionDetails, SessionDetailTopicVote } from '../services/estimation.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  @Input() session: SessionDetails;
  isDetailed = false;

  @Output() remove = new EventEmitter<SessionDetailMember>();

  constructor() {}
  get isAdmin(): boolean {
    return !!this.session.adminSecret;
  }

  ngOnInit(): void {}

  byId(member: SessionDetailMember) {
    return member.id;
  }

  getVote(member: SessionDetailMember) {
    return this.session.activeTopic?.votes?.find((v) => v.memberId === member.id);
  }
}
