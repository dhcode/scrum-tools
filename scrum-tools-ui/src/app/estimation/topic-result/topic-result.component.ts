import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TopicDetailsFragment, TopicVoteDetailsFragment } from '../../../generated/graphql';

@Component({
  selector: 'app-topic-result',
  templateUrl: './topic-result.component.html',
  styleUrls: ['./topic-result.component.scss'],
})
export class TopicResultComponent implements OnChanges {
  @Input() topic: TopicDetailsFragment;
  @Input() showOptions = false;

  popularVote = undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if ('topic' in changes && this.topic) {
      this.sortVotes();
      this.checkPopularVote();
    }
  }

  checkPopularVote() {
    this.popularVote = undefined;
    if (this.topic.endedAt) {
      let bestCount = 0;
      for (const option of this.topic.options) {
        const count = this.topic.votes.filter((v) => v.vote === option).length;
        if (count > bestCount) {
          bestCount = count;
          this.popularVote = option;
        } else if (count === bestCount) {
          this.popularVote = undefined;
        }
      }
    }
  }

  sortVotes() {
    this.topic.votes.sort((a, b) => {
      if (a.vote < b.vote) {
        return -1;
      }
      if (a.vote > b.vote) {
        return 1;
      }
      if (a.votedAt < b.votedAt) {
        return -1;
      }
      if (a.votedAt > b.votedAt) {
        return -1;
      }
      return 0;
    });
  }

  byId(vote: TopicVoteDetailsFragment) {
    return vote.memberId + vote.vote;
  }
}
