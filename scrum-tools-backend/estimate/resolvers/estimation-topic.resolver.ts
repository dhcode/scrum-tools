import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { EstimationSession, EstimationTopic, TopicVote } from '../models/estimation-models';
import { EstimationService } from '../estimation/estimation.service';
import { CreateSessionArgs, CreateTopicArgs } from '../models/estimation-requests';

@Resolver(() => EstimationTopic)
export class EstimationTopicResolver {
  constructor(private estimationService: EstimationService) {}

  @ResolveField(() => [TopicVote])
  async votes(@Parent() topic: EstimationTopic): Promise<TopicVote[]> {
    return this.estimationService.getVotes(topic.id);
  }
}
