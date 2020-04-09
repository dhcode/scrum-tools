import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { EstimationMember, EstimationSession, EstimationTopic } from '../../scrum-tools-api/estimate/estimation-models';
import { EstimationService, sessionRoomName } from './estimation/estimation.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateSessionArgs, GetSessionArgs, JoinSessionArgs } from '../../scrum-tools-api/estimate/estimation-requests';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => EstimationSession)
export class EstimationSessionResolver {
  pubSub = new PubSub();

  constructor(private estimationService: EstimationService) {}

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

  @ResolveField()
  async activeTopic(@Parent() session: EstimationSession): Promise<EstimationTopic> {
    return this.estimationService.getActiveTopic(session.id);
  }

  @ResolveField()
  async topics(
    @Parent() session: EstimationSession,
    @Args('limit', { defaultValue: 10, type: () => Int }) limit = 10,
  ): Promise<EstimationTopic[]> {
    return this.estimationService.getTopics(session.id, limit);
  }

  @ResolveField()
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
    const member = await this.estimationService.addMember(session.id, args.name);
    console.log('member', member);
    await this.pubSub.publish(sessionRoomName(session.id), { memberUpdated: member });
    return member;
  }

  @Subscription(() => EstimationMember)
  async memberUpdated(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.pubSub.asyncIterator(sessionRoomName(session.id));
  }
}
