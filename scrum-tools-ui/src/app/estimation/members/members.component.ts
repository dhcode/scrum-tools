import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionDetailMember, SessionDetailTopicVote } from '../services/estimation.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  @Input() members: SessionDetailMember[] = [];
  @Input() votes: SessionDetailTopicVote[] = [];
  @Input() isAdmin: boolean;
  isDetailed = false;

  @Output() remove = new EventEmitter<SessionDetailMember>();

  constructor() {}

  ngOnInit(): void {}

  byId(member: SessionDetailMember) {
    return member.id;
  }

  getVote(member: SessionDetailMember) {
    return this.votes?.find((v) => v.memberId === member.id);
  }
}
