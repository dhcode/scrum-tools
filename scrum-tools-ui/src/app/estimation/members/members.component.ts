import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionDetailMember, SessionDetailTopicVote } from '../services/estimation.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  @Input() members: SessionDetailMember[] = [];
  @Input() votes: SessionDetailTopicVote[] = [];
  @Input() isAdmin: boolean;

  @Output() remove = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
