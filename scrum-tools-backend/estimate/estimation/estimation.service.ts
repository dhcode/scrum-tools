import { Injectable } from '@nestjs/common';
import {
  EstimationMember,
  EstimationSession,
  EstimationTopic,
  TopicVote,
} from '../../../scrum-tools-api/estimate/estimation-models';
import { randomString } from '../../shared/utils';
import { RedisService } from '../../redis/redis.service';
import { Namespace } from 'socket.io';

const expireSeconds = 90 * 86400;

export function sessionRoomName(sessionId: string) {
  return 'session:' + sessionId;
}

@Injectable()
export class EstimationService {
  private namespace: Namespace;

  constructor(private redis: RedisService) {}

  setNamespace(ns: Namespace) {
    this.namespace = ns;
  }

  private notifySession(sessionId: string, event: string, data) {
    if (this.namespace) {
      this.namespace.to(sessionRoomName(sessionId)).emit(event, data);
    }
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
      defaultOptions: defaultOptions || [1, 2, 3, 5, 8, 13, 20, 40, null],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
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
      joinedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    await this.redis.insertListEntry('estSessionMembers', sessionId, member, expireSeconds);
    await this.updateEstimationExpiry(sessionId);
    this.notifySession(sessionId, 'addMember', member);
    return member;
  }

  async updateMemberLastSeen(sessionId: string, memberId: string): Promise<void> {
    const member = await this.redis.getListEntryById<EstimationMember>('estSessionMembers', sessionId, memberId);
    member.lastSeenAt = new Date().toISOString();
    await this.redis.updateListEntry('estSessionMembers', sessionId, memberId, member);
    await this.updateEstimationExpiry(sessionId);
    this.notifySession(sessionId, 'updateMember', member);
  }

  async removeMember(sessionId: string, memberId: string): Promise<void> {
    await this.redis.removeListEntry('estSessionMembers', sessionId, memberId);
    await this.updateEstimationExpiry(sessionId);
    this.notifySession(sessionId, 'removeMember', memberId);
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
      startedAt: new Date().toISOString(),
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

    this.notifySession(session.id, 'createTopic', topic);

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

  async getTopic(topicId: string): Promise<EstimationTopic> {
    return this.redis.getObjectById('estSessionTopic', topicId);
  }

  async addVote(topicId: string, member: EstimationMember, voteValue: number): Promise<TopicVote> {
    const vote: TopicVote = {
      memberId: member.id,
      memberName: member.name,
      vote: voteValue,
      votedAt: new Date().toISOString(),
    };
    const topic = await this.getTopic(topicId);
    if (topic.endedAt) {
      throw new Error('Vote could not be added');
    }
    await this.redis.updateListEntry('estSessionTopicVote', topicId, member.id, vote);
    await this.redis.updateExpiry('estSessionTopicVote', topicId, expireSeconds);

    this.notifySession(topic.sessionId, 'addVote', {
      memberId: vote.memberId,
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

    topic.endedAt = new Date().toISOString();
    await this.redis.updateObject('estSessionTopic', topicId, {
      endedAt: topic.endedAt,
    });

    this.notifySession(topic.sessionId, 'endVote', {
      topic: topic,
      votes: await this.getVotes(topic.id),
    });
  }
}
