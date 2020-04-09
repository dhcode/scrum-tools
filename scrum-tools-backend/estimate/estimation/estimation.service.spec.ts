import { Test, TestingModule } from '@nestjs/testing';
import { EstimationService } from './estimation.service';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service';

describe('EstimationService', () => {
  let module: TestingModule;
  let service: EstimationService;
  let redisService: RedisService;

  beforeEach(async () => {
    process.env.REDIS_URI = 'redis://127.0.0.1:6379/2';
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env_test' })],
      providers: [EstimationService, RedisService],
    }).compile();

    service = module.get<EstimationService>(EstimationService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    await redisService.deleteAll();
    await module.close();
  });

  it('should insert and find', async () => {
    const estimationSession = await service.createEstimationSession('My session', 'This is a nice session');
    expect(estimationSession.name).toBe('My session');
    expect(estimationSession.description).toBe('This is a nice session');
    expect(estimationSession.defaultOptions).toEqual([1, 2, 3, 5, 8, 13, 20, 40, null]);

    const result = await service.getEstimationSession(estimationSession.id);
    expect(result.name).toBe('My session');
    expect(result.description).toBe('This is a nice session');
    expect(result.defaultOptions).toEqual([1, 2, 3, 5, 8, 13, 20, 40, null]);
  });

  it('should add and remove members', async () => {
    const session = await service.createEstimationSession('My session', 'This is a nice session');
    const member = await service.addMember(session.id, 'Tester');
    const members = await service.getMembers(session.id);
    expect(members.length).toBe(1);
    expect(members[0].id).toBe(member.id);
    expect(members[0].name).toBe('Tester');

    await service.removeMember(session.id, member.id);
    const result2 = await service.getMembers(session.id);
    expect(result2.length).toBe(0);
  });

  it('should handle topic', async () => {
    const session = await service.createEstimationSession('My session', 'This is a nice session');
    const member = await service.addMember(session.id, 'Tester');
    const topic = await service.createTopic(session, 'Topic 1', 'Some topic');
    const activeTopic = await service.getActiveTopic(session.id);

    expect(activeTopic).toBeTruthy();
    expect(activeTopic.id).toBe(topic.id);
    expect(activeTopic.name).toBe('Topic 1');
    expect(activeTopic.description).toBe('Some topic');
    expect(activeTopic.options).toEqual(session.defaultOptions);

    await service.addVote(activeTopic.id, member, 3);

    const votes = await service.getVotes(activeTopic.id);

    expect(votes.length).toBe(1);
    expect(votes[0].memberName).toBe(member.name);
    expect(votes[0].memberId).toBe(member.id);
    expect(votes[0].vote).toBe(3);
  });
});
