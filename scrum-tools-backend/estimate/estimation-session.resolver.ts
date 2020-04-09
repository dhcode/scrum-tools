import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { EstimationMember, EstimationSession, EstimationTopic } from '../../scrum-tools-api/estimate/estimation-models';
import { EstimationService } from './estimation/estimation.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateSessionArgs } from '../../scrum-tools-api/estimate/estimation-requests';

@Resolver(() => EstimationSession)
export class EstimationSessionResolver {
  constructor(private estimationService: EstimationService) {}

  @Query(() => EstimationSession)
  async estimationSession(
    @Args('id') id: string,
    @Args('joinSecret') joinSecret: string,
    @Args('adminSecret', { nullable: true }) adminSecret: string,
  ): Promise<EstimationSession> {
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
}
