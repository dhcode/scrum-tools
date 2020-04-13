import { Injectable } from '@nestjs/common';
import { EstimationMember, EstimationSession, EstimationTopic, TopicVote } from '../models/estimation-models';
import { randomString } from '../../shared/utils';
import { RedisService } from '../../redis/redis.service';
import { EstimationError } from '../models/estimation-error';

const expireSeconds = 90 * 86400;
enum Store {
  session = 'estSession', // hash key per session
  members = 'estSessionMembers', // hash key per session, field per member
  topics = 'estSessionTopics', // list key per session, entries with topicIds
  topic = 'estSessionTopic', // hash key per topic
  vote = 'estSessionTopicVote', // hash key per topic, field per vote
}

export enum SessionNotify {
  sessionUpdated = 'sessionUpdated',
  memberAdded = 'memberAdded',
  memberUpdated = 'memberUpdated',
  memberRemoved = 'memberRemoved',
  topicCreated = 'topicCreated',
  voteAdded = 'voteAdded',
  voteEnded = 'voteEnded',
}

export function sessionRoomName(sessionId: string) {
  return 'session:' + sessionId;
}

@Injectable()
export class EstimationService {
  constructor(private redis: RedisService) {}

  private notifySession(sessionId: string, event: string, data) {
    const msg = {};
    msg[event] = data;
    this.redis.pubSub.publish(sessionRoomName(sessionId), msg);
  }

  async createEstimationSession(
    name: string,
    description: string,
    defaultOptions?: number[],
  ): Promise<EstimationSession> {
    const session: EstimationSession = {
      id: null,
      name: name,
      description: description,
      defaultOptions: defaultOptions || [1, 2, 3, 5, 8, 13, 20, 40, 0],
      createdAt: new Date(),
      modifiedAt: new Date(),
      adminSecret: randomString(16),
      joinSecret: randomString(6),
    };

    await this.redis.insertObject(Store.session, session, expireSeconds);

    return session;
  }

  async updateEstimationSession(
    id: string,
    data: Partial<Pick<EstimationSession, 'name' | 'description' | 'joinSecret' | 'defaultOptions'>>,
  ): Promise<EstimationSession> {
    const session = await this.getEstimationSession(id);
    if (!session) {
      throw new EstimationError(404, 'sessionNotFound', `Session with the id '${id}' was not found`);
    }

    if ('name' in data) {
      session.name = data.name;
    }
    if ('description' in data) {
      session.description = data.description;
    }
    if ('joinSecret' in data) {
      session.joinSecret = data.joinSecret;
    }
    if ('defaultOptions' in data) {
      session.defaultOptions = data.defaultOptions;
    }

    session.modifiedAt = new Date();

    await this.redis.updateObject(Store.session, id, { ...data, modifiedAt: session.modifiedAt });
    await this.updateEstimationExpiry(id);
    this.notifySession(session.id, SessionNotify.sessionUpdated, session);

    return session;
  }

  private async updateEstimationExpiry(sessionId: string) {
    await this.redis.updateExpiry(Store.session, sessionId, expireSeconds);
    await this.redis.updateExpiry(Store.members, sessionId, expireSeconds);
    await this.redis.updateExpiry(Store.topics, sessionId, expireSeconds);
  }

  getEstimationSession(id: string): Promise<EstimationSession> {
    return this.redis.getObjectById(Store.session, id);
  }

  async addMember(sessionId: string, name: string): Promise<EstimationMember> {
    const member = {
      id: null,
      name: name,
      secret: randomString(16),
      joinedAt: new Date(),
      lastSeenAt: new Date(),
    };

    const members = await this.getMembers(sessionId);
    if (members.find((m) => m.name === name)) {
      throw new EstimationError(409, 'memberExists', `Member with name '${name}' already exists`);
    }

    await this.redis.insertListEntry(Store.members, sessionId, member, expireSeconds);
    await this.updateEstimationSession(sessionId, {});
    this.notifySession(sessionId, SessionNotify.memberAdded, member);
    return member;
  }

  async updateMemberLastSeen(sessionId: string, memberId: string): Promise<EstimationMember> {
    const member = await this.getMember(sessionId, memberId);
    member.lastSeenAt = new Date();
    await this.updateMember(sessionId, memberId, member);
    return member;
  }

  private async updateMember(sessionId: string, memberId: string, member: EstimationMember) {
    await this.redis.updateListEntry(Store.members, sessionId, memberId, member);
    await this.updateEstimationExpiry(sessionId);
    this.notifySession(sessionId, SessionNotify.memberUpdated, member);
  }

  async getMember(sessionId: string, memberId: string): Promise<EstimationMember> {
    return this.redis.getListEntryById<EstimationMember>(Store.members, sessionId, memberId);
  }

  async removeMember(sessionId: string, memberId: string): Promise<boolean> {
    const member = await this.getMember(sessionId, memberId);
    if (member) {
      await this.redis.removeListEntry(Store.members, sessionId, memberId);
      await this.updateEstimationSession(sessionId, {});
      this.notifySession(sessionId, SessionNotify.memberRemoved, member);
      return true;
    }
    return false;
  }

  async getMembers(sessionId: string): Promise<EstimationMember[]> {
    return await this.redis.getListEntries<EstimationMember>(Store.members, sessionId);
  }

  async createTopic(session: EstimationSession, name: string, description: string): Promise<EstimationTopic> {
    const topic: EstimationTopic = {
      id: null,
      sessionId: session.id,
      name: name,
      description: description,
      options: session.defaultOptions,
      startedAt: new Date(),
      endedAt: null,
    };

    const activeTopic = await this.getActiveTopic(session.id);
    if (activeTopic) {
      this.endVote(activeTopic.id);
    }

    await this.redis.insertObject(Store.topic, topic, expireSeconds);
    const multi = this.redis.redis.multi();
    const topicsListKey = Store.topics + ':' + session.id;
    multi.lpush(topicsListKey, topic.id);
    multi.ltrim(topicsListKey, 0, 99);
    multi.expire(topicsListKey, expireSeconds);
    await multi.exec();

    this.notifySession(session.id, SessionNotify.topicCreated, topic);

    await this.updateEstimationSession(topic.sessionId, {});

    return topic;
  }

  async getActiveTopic(sessionId: string): Promise<EstimationTopic> {
    const topicId = await this.redis.redis.lindex(Store.topics + ':' + sessionId, 0);
    if (!topicId) {
      return undefined;
    }
    console.log('topicId', topicId);
    const topic = await this.getTopic(topicId);
    console.log('topic', topic);
    if (topic && topic.endedAt === null) {
      return topic;
    }
    return undefined;
  }

  async getTopics(sessionId: string, limit = 100): Promise<EstimationTopic[]> {
    const topicIds = await this.redis.redis.lrange(Store.topics + ':' + sessionId, 0, limit);
    const result = [];
    for (const topicId of topicIds) {
      result.push(this.getTopic(topicId));
    }
    return result;
  }

  async getTopic(topicId: string): Promise<EstimationTopic> {
    return this.redis.getObjectById(Store.topic, topicId);
  }

  async addVote(topicId: string, member: EstimationMember, voteValue: number): Promise<TopicVote> {
    const vote: TopicVote = {
      memberId: member.id,
      memberName: member.name,
      vote: voteValue,
      votedAt: new Date(),
    };
    const topic = await this.getTopic(topicId);
    if (topic.endedAt) {
      throw new EstimationError(400, 'voteEnded', 'Vote could not be added, because voting has ended.');
    }
    await this.redis.updateListEntry(Store.vote, topicId, member.id, vote);
    await this.redis.updateExpiry(Store.vote, topicId, expireSeconds);

    this.notifySession(topic.sessionId, SessionNotify.voteAdded, {
      member: member,
      votedAt: vote.votedAt,
    });

    return vote;
  }

  async getVotes(topicId: string): Promise<TopicVote[]> {
    return await this.redis.getListEntries(Store.vote, topicId);
  }

  async endVote(topicId: string): Promise<void> {
    const topic = await this.getTopic(topicId);
    if (topic.endedAt) {
      throw new EstimationError(400, 'voteEnded', 'Voting has already ended.');
    }

    topic.endedAt = new Date();
    await this.redis.updateObject(Store.topic, topicId, {
      endedAt: topic.endedAt,
    });

    await this.updateEstimationSession(topic.sessionId, {});

    this.notifySession(topic.sessionId, SessionNotify.voteEnded, {
      topic: topic,
      votes: await this.getVotes(topic.id),
    });
  }
}
