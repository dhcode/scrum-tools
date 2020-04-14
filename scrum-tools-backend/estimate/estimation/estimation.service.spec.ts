import { Test, TestingModule } from '@nestjs/testing';
import { EstimationService, sessionRoomName } from './estimation.service';
import { RedisService } from '../../redis/redis.service';
import { RedisModule } from '../../redis/redis.module';
import { TestConfigModule } from '../../../test/test-utils';

describe('EstimationService', () => {
  let module: TestingModule;
  let service: EstimationService;
  let redisService: RedisService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TestConfigModule, RedisModule],
      providers: [EstimationService],
    }).compile();

    service = module.get<EstimationService>(EstimationService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    await redisService.deleteAll();
    await module.close();
  });

  it('should insert and find session', async () => {
    const session = await service.createEstimationSession('My session', 'This is a nice session');
    expect(session.name).toBe('My session');
    expect(session.description).toBe('This is a nice session');
    expect(session.defaultOptions).toEqual([1, 2, 3, 5, 8, 13, 20, 40, 0]);

    const eventsIterator = redisService.pubSub.asyncIterator(sessionRoomName(session.id));

    const result = await service.getEstimationSession(session.id);
    expect(result).toBeTruthy();
    expect(result.name).toBe('My session');
    expect(result.description).toBe('This is a nice session');
    expect(result.defaultOptions).toEqual([1, 2, 3, 5, 8, 13, 20, 40, 0]);

    const nextEvent = eventsIterator.next();
    await service.updateEstimationSession(session.id, { description: 'changed description' });
    const result2 = await service.getEstimationSession(session.id);
    expect(result2).toBeTruthy();
    expect(result2.name).toBe('My session');
    expect(result2.description).toBe('changed description');

    const event = (await nextEvent).value;
    expect(event.sessionUpdated).toEqual(result2);
  });

  it('should add, update and remove members', async () => {
    const session = await service.createEstimationSession('My session', 'This is a nice session');
    const member = await service.addMember(session.id, 'Tester');
    const members = await service.getMembers(session.id);
    expect(members.length).toBe(1);
    expect(members[0].id).toBe(member.id);
    expect(members[0].name).toBe('Tester');

    const updatedMember = await service.updateMemberLastSeen(session.id, member.id);
    expect(updatedMember.lastSeenAt.getTime()).toBeGreaterThan(member.lastSeenAt.getTime());

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

    await service.addVote(activeTopic, member, 3);

    const votes = await service.getVotes(activeTopic.id);

    expect(votes.length).toBe(1);
    expect(votes[0].memberName).toBe(member.name);
    expect(votes[0].memberId).toBe(member.id);
    expect(votes[0].vote).toBe(3);
  });
});
