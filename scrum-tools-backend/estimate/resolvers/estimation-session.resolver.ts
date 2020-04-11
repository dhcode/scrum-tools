import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import {
  EstimationMember,
  EstimationSession,
  EstimationTopic,
  VoteAddedInfo,
  VoteEndedInfo,
} from '../models/estimation-models';
import { EstimationService, sessionRoomName } from '../estimation/estimation.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateSessionArgs, GetSessionArgs, JoinSessionArgs } from '../models/estimation-requests';
import { RedisService } from '../../redis/redis.service';

@Resolver(() => EstimationSession)
export class EstimationSessionResolver {
  constructor(private estimationService: EstimationService, private redisService: RedisService) {}

  @Query(() => EstimationSession)
  async estimationSession(@Args() args: GetSessionArgs): Promise<EstimationSession> {
    const { id, joinSecret, adminSecret } = args;
    const session = await this.estimationService.getEstimationSession(id);
    if (session && (session.joinSecret === joinSecret || session.adminSecret === adminSecret)) {
      if (session.adminSecret === adminSecret) {
        return session;
      } else {
        return { ...session, adminSecret: null };
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  @ResolveField(() => EstimationTopic)
  async activeTopic(@Parent() session: EstimationSession): Promise<EstimationTopic> {
    return this.estimationService.getActiveTopic(session.id);
  }

  @ResolveField(() => [EstimationTopic])
  async topics(
    @Parent() session: EstimationSession,
    @Args('limit', { defaultValue: 10, type: () => Int }) limit = 10,
  ): Promise<EstimationTopic[]> {
    return this.estimationService.getTopics(session.id, limit);
  }

  @ResolveField(() => [EstimationMember])
  async members(@Parent() session: EstimationSession): Promise<EstimationMember[]> {
    return this.estimationService.getMembers(session.id);
  }

  @Mutation(() => EstimationSession)
  async createSession(@Args() args: CreateSessionArgs) {
    return this.estimationService.createEstimationSession(args.name, args.description, args.defaultOptions);
  }

  @Mutation(() => EstimationMember)
  async joinSession(@Args() args: JoinSessionArgs): Promise<EstimationMember> {
    const session = await this.estimationSession(args);
    return await this.estimationService.addMember(session.id, args.name);
  }

  @Subscription(() => EstimationMember, {
    filter: (payload) => !!payload['memberUpdated'],
  })
  async memberUpdated(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => EstimationMember, {
    filter: (payload) => {
      console.log('payload', payload);
      return !!payload['memberAdded'];
    },
  })
  async memberAdded(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => EstimationMember, {
    filter: (payload) => !!payload['memberRemoved'],
  })
  async memberRemoved(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => EstimationTopic, {
    filter: (payload) => !!payload['topicCreated'],
  })
  async topicCreated(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => VoteAddedInfo, {
    filter: (payload) => !!payload['voteAdded'],
  })
  async voteAdded(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => VoteEndedInfo, {
    filter: (payload) => !!payload['voteEnded'],
  })
  async voteEnded(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }
}
