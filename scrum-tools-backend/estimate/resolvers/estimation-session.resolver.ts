import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { EstimationMember, EstimationSession, EstimationTopic, TopicVote } from '../models/estimation-models';
import { EstimationService, SessionNotify, sessionRoomName } from '../estimation/estimation.service';
import {
  AddVoteArgs,
  CreateSessionArgs,
  CreateTopicArgs,
  EndVoteArgs,
  GetSessionArgs,
  JoinSessionArgs,
  LeaveSessionArgs,
  PingMemberArgs,
  RemoveMemberArgs,
  UpdateSessionArgs,
} from '../models/estimation-requests';
import { RedisService } from '../../redis/redis.service';
import { clearMember, clearSession, clearVote } from '../models/model.utils';
import { EstimationError } from '../models/estimation-error';

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
      throw new EstimationError(
        404,
        'sessionNotFound',
        `Session with id '${args.id}' was not found or invalid secret provided.`,
      );
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
    return (await this.estimationService.getMembers(session.id)).map(clearMember);
  }

  @Mutation(() => EstimationSession)
  async createSession(@Args() args: CreateSessionArgs) {
    return this.estimationService.createEstimationSession(args.name, args.description, args.defaultOptions);
  }

  @Mutation(() => EstimationSession)
  async updateSession(@Args() args: UpdateSessionArgs) {
    const session = await this.estimationSession({ ...args, joinSecret: '' });
    if (!session.adminSecret) {
      throw new EstimationError(403, 'updateNotAllowed', 'Session id or admin secret are not correct.');
    }
    return this.estimationService.updateEstimationSession(args.id, args);
  }

  @Mutation(() => EstimationMember)
  async joinSession(@Args() args: JoinSessionArgs): Promise<EstimationMember> {
    const session = await this.estimationSession(args);
    return await this.estimationService.addMember(session.id, args.name);
  }

  @Mutation(() => Boolean)
  async leaveSession(@Args() args: LeaveSessionArgs): Promise<boolean> {
    const member = await this.estimationService.getMember(args.id, args.memberId);
    if (!member || member.secret !== args.secret) {
      throw new EstimationError(404, 'memberNotFound', 'Member not found or invalid secret');
    }
    return await this.estimationService.removeMember(args.id, args.memberId);
  }

  @Mutation(() => Boolean)
  async pingSessionMember(@Args() args: PingMemberArgs): Promise<boolean> {
    const member = await this.estimationService.getMember(args.id, args.memberId);
    if (!member || member.secret !== args.secret) {
      throw new EstimationError(404, 'memberNotFound', 'Member not found or invalid secret');
    }
    await this.estimationService.updateMemberLastSeen(args.id, member.id);
    return true;
  }

  @Mutation(() => Boolean)
  async removeMember(@Args() args: RemoveMemberArgs): Promise<boolean> {
    const session = await this.estimationSession({ ...args, joinSecret: '' });
    if (!session.adminSecret) {
      throw new EstimationError(403, 'updateNotAllowed', 'Session id or admin secret are not correct.');
    }
    return this.estimationService.removeMember(args.id, args.memberId);
  }

  @Mutation(() => EstimationTopic)
  async createTopic(@Args() args: CreateTopicArgs) {
    const session = await this.estimationSession({ ...args, joinSecret: '' });
    if (!session.adminSecret) {
      throw new EstimationError(403, 'notAllowed', 'Session id or admin secret are not correct.');
    }
    return this.estimationService.createTopic(session, args.name, args.description ?? '');
  }

  @Mutation(() => EstimationTopic)
  async endVote(@Args() args: EndVoteArgs) {
    const session = await this.estimationSession({ ...args, joinSecret: '' });
    if (!session.adminSecret) {
      throw new EstimationError(403, 'notAllowed', 'Session id or admin secret are not correct.');
    }
    const topic = await this.estimationService.getTopic(args.topicId);
    if (!topic) {
      throw new EstimationError(404, 'topicNotFound', 'Topic not found.');
    }
    return this.estimationService.endVote(args.topicId);
  }

  @Mutation(() => TopicVote)
  async addVote(@Args() args: AddVoteArgs) {
    const member = await this.estimationService.getMember(args.id, args.memberId);
    if (!member || member.secret !== args.secret) {
      throw new EstimationError(404, 'memberNotFound', 'Member not found or invalid secret');
    }
    const topic = await this.estimationService.getActiveTopic(args.id);
    if (!topic) {
      throw new EstimationError(404, 'topicNotFound', 'No active topic found in session');
    }
    return this.estimationService.addVote(topic, member, args.vote);
  }

  @Subscription(() => EstimationSession, {
    filter: (payload) => !!payload[SessionNotify.sessionUpdated],
    resolve: (payload, args1, ctx) => clearSession(payload[SessionNotify.sessionUpdated], ctx.isAdmin),
  })
  async sessionUpdated(@Args() args: GetSessionArgs, @Context() ctx: any) {
    const session = await this.estimationSession(args);
    ctx.isAdmin = !!session.adminSecret;
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => EstimationMember, {
    filter: (payload) => !!payload[SessionNotify.memberUpdated],
    resolve: (payload) => clearMember(payload[SessionNotify.memberUpdated]),
  })
  async memberUpdated(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => EstimationMember, {
    filter: (payload) => !!payload[SessionNotify.memberAdded],
    resolve: (payload) => clearMember(payload[SessionNotify.memberAdded]),
  })
  async memberAdded(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => EstimationMember, {
    filter: (payload) => !!payload[SessionNotify.memberRemoved],
    resolve: (payload) => clearMember(payload[SessionNotify.memberRemoved]),
  })
  async memberRemoved(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => EstimationTopic, {
    filter: (payload) => !!payload[SessionNotify.topicCreated],
  })
  async topicCreated(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => TopicVote, {
    filter: (payload) => !!payload[SessionNotify.voteAdded],
    resolve: (payload) => clearVote(payload[SessionNotify.voteAdded]),
  })
  async voteAdded(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }

  @Subscription(() => EstimationTopic, {
    filter: (payload) => !!payload[SessionNotify.voteEnded],
  })
  async voteEnded(@Args() args: GetSessionArgs) {
    const session = await this.estimationSession(args);
    return this.redisService.pubSub.asyncIterator(sessionRoomName(session.id));
  }
}
