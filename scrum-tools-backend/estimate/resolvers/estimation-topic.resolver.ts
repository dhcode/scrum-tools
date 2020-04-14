import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { EstimationTopic, TopicVote } from '../models/estimation-models';
import { EstimationService } from '../estimation/estimation.service';

@Resolver(() => EstimationTopic)
export class EstimationTopicResolver {
  constructor(private estimationService: EstimationService) {}

  @ResolveField(() => [TopicVote])
  async votes(@Parent() topic: EstimationTopic): Promise<TopicVote[]> {
    const votes = await this.estimationService.getVotes(topic.id);
    if (!topic.endedAt) {
      for (const vote of votes) {
        vote.vote = null;
      }
    }
    return votes;
  }
}
