import { Component, Input, OnInit } from '@angular/core';
import { TopicDetailsFragment } from '../../../generated/graphql';

@Component({
  selector: 'app-topic-result',
  templateUrl: './topic-result.component.html',
  styleUrls: ['./topic-result.component.scss'],
})
export class TopicResultComponent implements OnInit {
  @Input() topic: TopicDetailsFragment;
  @Input() showOptions = false;

  constructor() {}

  ngOnInit(): void {}
}
