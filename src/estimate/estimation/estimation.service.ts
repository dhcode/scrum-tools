import { Inject, Injectable } from '@nestjs/common';
import { EstimationMember, EstimationSession } from '../models/estimation-session';
import { Collection, Db } from 'mongodb';
import { randomString, retryInsert } from '../../shared/utils';
import { addDays } from 'date-fns';
import { EstimationTopic, TopicVote } from '../models/estimation-topic';
import { Redis } from 'ioredis';

function getExpireDate(): Date {
  return addDays(new Date(), 90);
}

@Injectable()
export class EstimationService {
  constructor(private db: Db, @Inject('REDIS') private redis: Redis) {}

  private get estimationCollection(): Collection<EstimationSession> {
    return this.db.collection('estimationSessions');
  }

  private get topicCollection(): Collection<EstimationTopic> {
    return this.db.collection('estimationTopic');
  }

  async setupCollections() {
    await this.topicCollection.createIndex({ sessionId: 1 });
  }

  async createEstimationSession(
    name: string,
    description: string,
    defaultOptions?: number[],
  ): Promise<EstimationSession> {
    const session: EstimationSession = {
      _id: randomString(),
      name: name,
      description: description,
      defaultOptions: defaultOptions || [1, 2, 3, 5, 8, 13, 20, 40, null],
      createdAt: new Date(),
      modifiedAt: new Date(),
      expiresAt: getExpireDate(),
      members: [],
      adminSecret: randomString(16),
      joinSecret: randomString(6),
    };

    await retryInsert(this.estimationCollection, session);

    return session;
  }

  getEstimationSession(id: string): Promise<EstimationSession> {
    return this.estimationCollection.findOne({ _id: id });
  }

  async addMember(sessionId: string, name: string): Promise<EstimationMember> {
    const member = {
      id: randomString(),
      name: name,
      joinedAt: new Date(),
      lastSeenAt: new Date(),
    };

    await this.estimationCollection.updateOne(
      { _id: sessionId },
      { $push: { members: member }, $set: { expiresAt: getExpireDate() } },
    );

    return member;
  }

  async updateMemberLastSeen(sessionId: string, memberId: string): Promise<void> {
    await this.estimationCollection.updateOne(
      { _id: sessionId, 'members.id': memberId },
      { $set: { 'members.$.lastSeenAt': new Date(), expiresAt: getExpireDate() } },
    );
  }

  async removeMember(sessionId: string, memberId: string): Promise<void> {
    await this.estimationCollection.updateOne(
      { _id: sessionId },
      { $pull: { members: { id: memberId } }, $set: { expiresAt: getExpireDate() } },
    );
  }

  async createTopic(session: EstimationSession, name: string, description: string): Promise<EstimationTopic> {
    const topic: EstimationTopic = {
      _id: session._id + ':' + randomString(),
      sessionId: session._id,
      name: name,
      description: description,
      options: session.defaultOptions,
      startedAt: new Date(),
      endedAt: null,
      votes: [],
    };

    const activeTopic = await this.getActiveTopic(session._id);
    if (activeTopic) {
      this.endVote(activeTopic._id);
    }

    await this.topicCollection.insertOne(topic);

    return topic;
  }

  async getActiveTopic(sessionId: string): Promise<EstimationTopic> {
    return this.topicCollection.findOne({ sessionId: sessionId, endedAt: null }, { sort: { startedAt: -1 } });
  }

  async getTopic(topicId: string): Promise<EstimationTopic> {
    return this.topicCollection.findOne({ _id: topicId });
  }

  async addVote(topicId: string, member: EstimationMember, voteValue: number): Promise<TopicVote> {
    const vote: TopicVote = {
      memberId: member.id,
      memberName: member.name,
      vote: voteValue,
      votedAt: new Date(),
    };

    const result = await this.topicCollection.updateOne({ _id: topicId, endedAt: null }, { $push: { votes: vote } });
    if (!result.modifiedCount) {
      throw new Error('Vote could not be added');
    }
    return vote;
  }

  async endVote(topicId: string): Promise<void> {
    const result = await this.topicCollection.updateOne(
      { _id: topicId, endedAt: null },
      { $set: { endedAt: new Date() } },
    );
    if (!result.modifiedCount) {
      throw new Error('Vote already ended');
    }
  }
}
