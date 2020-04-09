import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

describe('RedisService', () => {
  let service: RedisService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env_test' })],
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    await service.deleteAll();
    await module.close();
  });

  it('should transform hashes', async () => {
    const testHash = { name: 'test', count: 54, list: [true, false] };
    await service.redis.hmset('test', testHash);

    const result = await service.redis.hgetall('test');
    expect(result).toBeTruthy();
    expect(result.name).toBe('test');
    expect(result.count).toBe(54);
    expect(result.list[0]).toBe(true);
    expect(result.list[1]).toBe(false);
  });

  it('should insert and find object', async () => {
    const testObj = {
      id: null,
      name: 'Object 1',
      active: true,
    };

    await service.insertObject('tests', testObj);
    expect(testObj.id).toBeTruthy();
    expect(testObj.id.length).toBe(10);

    const result = await service.getObjectById<Record<string, any>>('tests', testObj.id);
    expect(result).toEqual(testObj);
  });

  it('should insert and get list', async () => {
    const entry = {
      id: null,
      name: 'E1',
      active: true,
    };
    const entry2 = {
      id: null,
      name: 'E2',
      active: false,
    };

    await service.insertListEntry('testList', 'list1', entry);
    await service.insertListEntry('testList', 'list1', entry2);
    expect(entry.id).toBeTruthy();
    expect(entry.id.length).toBe(10);

    expect(entry2.id).toBeTruthy();
    expect(entry2.id.length).toBe(10);

    const result = await service.getListEntryById('testList', 'list1', entry.id);
    expect(result).toEqual(entry);

    const results = await service.getListEntries('testList', 'list1');
    expect(results.length).toBe(2);
    expect(results).toContainEqual(entry);
    expect(results).toContainEqual(entry2);
  });

  it('should get non existing object', async () => {
    const result = await service.getObjectById('no', 'what?');
    expect(result).toBeUndefined();
  });

  it('should get non existing list entry', async () => {
    const result = await service.getListEntryById('no', 'list?', 'what?');
    expect(result).toBeUndefined();
  });

  it('should get non existing list entries', async () => {
    const result = await service.getListEntries('no', 'list?');
    expect(result).toEqual([]);
  });
});
