import { Injectable } from '@nestjs/common';
import {
  EstimationMember,
  EstimationSession,
  EstimationTopic,
  TopicVote,
} from '../../../scrum-tools-api/estimate/estimation-models';
import { randomString } from '../../shared/utils';
import { RedisService } from '../../redis/redis.service';

const expireSeconds = 90 * 86400;

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

    await this.redis.insertObject('estSession', session, expireSeconds);

    return session;
  }

  async updateEstimationExpiry(sessionId: string) {
    await this.redis.updateExpiry('estSession', sessionId, expireSeconds);
    await this.redis.updateExpiry('estSessionMembers', sessionId, expireSeconds);
    await this.redis.updateExpiry('estSessionTopics', sessionId, expireSeconds);
  }

  getEstimationSession(id: string): Promise<EstimationSession> {
    return this.redis.getObjectById('estSession', id);
  }

  async addMember(sessionId: string, name: string): Promise<EstimationMember> {
    const member = {
      id: null,
      name: name,
      joinedAt: new Date(),
      lastSeenAt: new Date(),
    };

    const members = await this.getMembers(sessionId);
    if (members.find((m) => m.name === name)) {
      throw new Error(`Member with name '${name}' already exists`);
    }

    await this.redis.insertListEntry('estSessionMembers', sessionId, member, expireSeconds);
    await this.updateEstimationExpiry(sessionId);
    console.log('member', member);
    this.notifySession(sessionId, 'memberAdded', member);
    return member;
  }

  async updateMemberLastSeen(sessionId: string, memberId: string): Promise<void> {
    const member = await this.redis.getListEntryById<EstimationMember>('estSessionMembers', sessionId, memberId);
    member.lastSeenAt = new Date();
    await this.redis.updateListEntry('estSessionMembers', sessionId, memberId, member);
    await this.updateEstimationExpiry(sessionId);
    this.notifySession(sessionId, 'memberUpdated', member);
  }

  async removeMember(sessionId: string, memberId: string): Promise<void> {
    const member = await this.redis.getListEntryById('estSessionMembers', sessionId, memberId);
    if (member) {
      await this.redis.removeListEntry('estSessionMembers', sessionId, memberId);
      await this.updateEstimationExpiry(sessionId);
      this.notifySession(sessionId, 'memberRemoved', member);
    }
  }

  async getMembers(sessionId: string): Promise<EstimationMember[]> {
    return await this.redis.getListEntries<EstimationMember>('estSessionMembers', sessionId);
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

    await this.redis.insertObject('estSessionTopic', topic, expireSeconds);
    const multi = this.redis.redis.multi();
    const topicsListKey = 'estSessionTopics:' + session.id;
    multi.lpush(topicsListKey, topic.id);
    multi.ltrim(topicsListKey, 0, 99);
    multi.expire(topicsListKey, expireSeconds);
    await multi.exec();

    this.notifySession(session.id, 'topicCreated', topic);

    return topic;
  }

  async getActiveTopic(sessionId: string): Promise<EstimationTopic> {
    const topicId = await this.redis.redis.lindex('estSessionTopics:' + sessionId, 0);
    const topic = await this.getTopic(topicId);
    if (topic && topic.endedAt === null) {
      return topic;
    }
    return undefined;
  }

  async getTopics(sessionId: string, limit = 100): Promise<EstimationTopic[]> {
    const topicIds = await this.redis.redis.lrange('estSessionTopics:' + sessionId, 0, limit);
    const result = [];
    for (const topicId of topicIds) {
      result.push(this.getTopic(topicId));
    }
    return result;
  }

  async getTopic(topicId: string): Promise<EstimationTopic> {
    return this.redis.getObjectById('estSessionTopic', topicId);
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
      throw new Error('Vote could not be added');
    }
    await this.redis.updateListEntry('estSessionTopicVote', topicId, member.id, vote);
    await this.redis.updateExpiry('estSessionTopicVote', topicId, expireSeconds);

    this.notifySession(topic.sessionId, 'voteAdded', {
      member: member,
      votedAt: vote.votedAt,
    });

    return vote;
  }

  async getVotes(topicId: string): Promise<TopicVote[]> {
    return await this.redis.getListEntries('estSessionTopicVote', topicId);
  }

  async endVote(topicId: string): Promise<void> {
    const topic = await this.getTopic(topicId);
    if (topic.endedAt) {
      throw new Error('Vote already ended');
    }

    topic.endedAt = new Date();
    await this.redis.updateObject('estSessionTopic', topicId, {
      endedAt: topic.endedAt,
    });

    this.notifySession(topic.sessionId, 'voteEnded', {
      topic: topic,
      votes: await this.getVotes(topic.id),
    });
  }
}
