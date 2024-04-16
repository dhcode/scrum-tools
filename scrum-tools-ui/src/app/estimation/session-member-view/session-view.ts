import { EstimationService } from '../services/estimation.service';
import { LoadingState, trackLoading } from '../../shared/loading.util';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CodedError } from '../../shared/error-handling.util';
import { SessionDetailsFragment, TopicDetailsFragment, TopicVoteDetailsFragment } from '../../../generated/graphql';
import { Component, OnDestroy } from '@angular/core';

@Component({ template: '' })
// tslint:disable-next-line:component-class-suffix
export abstract class SessionView implements OnDestroy {
  sessionId: string;

  session: SessionDetailsFragment;

  currentTopic: TopicDetailsFragment;

  loadingState = new LoadingState();

  protected sub = new Subscription();

  protected constructor(
    protected route: ActivatedRoute,
    protected estimationService: EstimationService,
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadSession() {
    const sessionInfo = this.estimationService.getKnownSession(this.sessionId);
    if (!sessionInfo) {
      this.loadingState.error = new CodedError(
        'sessionNotFound',
        `The session behind id ${this.sessionId} is not known.`,
      );
      return;
    }

    this.sub.add(
      this.estimationService
        .getSession(sessionInfo)
        .pipe(trackLoading(this.loadingState))
        .subscribe((s) => {
          this.session = s;
          if (this.session) {
            this.identifyTopic();
          } else {
            this.currentTopic = null;
          }
          if (this.onSessionUpdated) {
            this.onSessionUpdated(this.session);
          }
        }),
    );

    this.sub.add(
      this.estimationService.subscribeSessionWithDetails(sessionInfo).subscribe((change) => {
        console.log('change', change);
        if ('voteAdded' in change.data) {
          this.estimationService.updateVotesInCache(this.currentTopic.id, change.data.voteAdded);
          // this.voteAdded(change.data.voteAdded);
        }

        if (this.onSessionChange) {
          this.onSessionChange(change);
        }
      }),
    );
  }

  private voteAdded(vote: TopicVoteDetailsFragment) {
    if (!this.currentTopic) {
      return;
    }
    const existing = this.currentTopic?.votes.findIndex((v) => v.memberId === vote.memberId);
    if (existing !== -1) {
      this.currentTopic.votes.splice(existing, 1, vote);
    } else {
      this.currentTopic.votes.push(vote);
    }
  }

  private identifyTopic() {
    if (this.session.activeTopic) {
      this.currentTopic = this.session.activeTopic;
      return;
    }
    if (!this.session.topics?.length) {
      return;
    }

    const topics = this.session.topics.slice();
    topics.sort((a, b) => {
      if (a.startedAt < b.startedAt) {
        return 1;
      }
      if (a.startedAt > b.startedAt) {
        return -1;
      }
      return 0;
    });

    this.currentTopic = topics[0];
  }

  onSessionUpdated?(session: SessionDetailsFragment) {}
  onSessionChange?(change) {}
}
