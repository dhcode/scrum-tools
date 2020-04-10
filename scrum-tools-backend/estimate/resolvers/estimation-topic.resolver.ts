import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { EstimationTopic, TopicVote } from '../../../scrum-tools-api/estimate/estimation-models';
import { EstimationService } from '../estimation/estimation.service';
import { RedisService } from '../../redis/redis.service';

@Resolver(() => EstimationTopic)
export class EstimationTopicResolver {
  constructor(private estimationService: EstimationService, private redisService: RedisService) {}

  @ResolveField(() => [TopicVote])
  async members(@Parent() topic: EstimationTopic): Promise<TopicVote[]> {
    return this.estimationService.getVotes(topic.id);
  }
}
