import { Test, TestingModule } from '@nestjs/testing';
import { EstimationService } from './estimation.service';
import { MongodbService } from '../../mongodb/mongodb.service';
import { randomDbProvider } from '../../../test/test-utils';
import { Db } from 'mongodb';
import { ConfigModule } from '@nestjs/config';

describe('EstimationService', () => {
  let service: EstimationService;
  let db: Db;
  let mongodbService: MongodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [EstimationService, MongodbService, randomDbProvider],
    }).compile();

    db = module.get(Db);
    service = module.get<EstimationService>(EstimationService);
    mongodbService = module.get<MongodbService>(MongodbService);
  });

  afterEach(async () => {
    await db.dropDatabase();
    await mongodbService.getMongoClient().then((c) => c.close());
  });

  it('should insert and find', async () => {
    const estimationSession = await service.createEstimationSession('My session', 'This is a nice session');
    expect(estimationSession.name).toBe('My session');
    expect(estimationSession.description).toBe('This is a nice session');
    expect(estimationSession.defaultOptions).toEqual([1, 2, 3, 5, 8, 13, 20, 40, null]);

    const result = await service.getEstimationSession(estimationSession._id);
    expect(result.name).toBe('My session');
    expect(result.description).toBe('This is a nice session');
    expect(result.defaultOptions).toEqual([1, 2, 3, 5, 8, 13, 20, 40, null]);
  });

  it('should add and remove members', async () => {
    const session = await service.createEstimationSession('My session', 'This is a nice session');
    const member = await service.addMember(session._id, 'Tester');
    const result = await service.getEstimationSession(session._id);
    expect(result.members.length).toBe(1);
    expect(result.members[0].id).toBe(member.id);
    expect(result.members[0].name).toBe('Tester');

    await service.removeMember(session._id, member.id);
    const result2 = await service.getEstimationSession(session._id);
    expect(result2.members.length).toBe(0);
  });

  it('should handle topic', async () => {
    const session = await service.createEstimationSession('My session', 'This is a nice session');
    const member = await service.addMember(session._id, 'Tester');
    const topic = await service.createTopic(session, 'Topic 1', 'Some topic');
    const activeTopic = await service.getActiveTopic(session._id);

    expect(activeTopic).toBeTruthy();
    expect(activeTopic._id).toBe(topic._id);
    expect(activeTopic.name).toBe('Topic 1');
    expect(activeTopic.description).toBe('Some topic');
    expect(activeTopic.options).toEqual(session.defaultOptions);

    await service.addVote(activeTopic._id, member, 3);

    const result = await service.getTopic(activeTopic._id);
    expect(result.votes.length).toBe(1);
    expect(result.votes[0].memberName).toBe(member.name);
    expect(result.votes[0].memberId).toBe(member.id);
    expect(result.votes[0].vote).toBe(3);
  });
});
