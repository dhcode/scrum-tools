import { Inject, Injectable, OnApplicationShutdown, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
import { Redis } from 'ioredis';
import { eJsonParse, eJsonStringify, randomString } from '../shared/utils';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  readonly redisUri: string;
  readonly pubSub: RedisPubSub;

  constructor(
    configService: ConfigService,
    @Inject('REDIS_CONNECTION') public redis: Redis,
  ) {
    this.redisUri = configService.get<string>('REDIS_URI');
    this.pubSub = new RedisPubSub({
      publisher: this.redis,
      subscriber: new IORedis(this.redisUri),
      serializer: eJsonStringify,
      deserializer: eJsonParse,
    });
  }

  static redisConnectionProvider: Provider = {
    provide: 'REDIS_CONNECTION',
    useFactory: (configService: ConfigService) => {
      const redisUri = configService.get<string>('REDIS_URI');
      const redis = new IORedis(redisUri, { lazyConnect: true });
      return new Promise((resolve, reject) => {
        const errHandler = (err) => {
          redis.disconnect();
          reject(err);
        };
        redis.once('error', errHandler);
        redis.connect(() => {
          redis.off('error', errHandler);
          resolve(redis);
        });
      });
    },
    inject: [ConfigService],
  };

  onApplicationShutdown(): any {
    this.pubSub.close();
    this.redis.disconnect();
  }

  private async ensureUniqueKey(prefix: string, tries = 10, idLen = 10): Promise<{ id: string; key: string }> {
    for (let i = 0; i < tries; i++) {
      const id = randomString(idLen);
      const key = prefix + id;
      if (await this.redis.setnx(prefix + id, '')) {
        return { id, key };
      }
    }
    throw new Error(`Could not generate unique id after ${tries} tries`);
  }

  async insertObject(collection: string, obj: Record<string, any>, expire?: number): Promise<string> {
    const { id, key } = await this.ensureUniqueKey(collection + ':');
    obj.id = id;
    const multi = this.redis.multi();
    multi.del(key);
    multi.hmset(key, obj);
    if (expire) {
      multi.expire(key, expire);
    }
    await multi.exec();
    return id;
  }

  async updateObject(collection: string, id: string, obj: Record<string, any>, expire?: number): Promise<string> {
    const key = collection + ':' + id;
    obj.id = id;
    const multi = this.redis.multi().hmset(key, obj);
    if (expire) {
      multi.expire(key, expire);
    }
    await multi.exec();
    return id;
  }

  async getObjectById<T>(collection: string, id: string): Promise<T> {
    const key = collection + ':' + id;
    return (await this.redis.hgetall(key)) as unknown as T;
  }

  async insertListEntry(
    collection: string,
    listId: string,
    obj: Record<string, any>,
    expire?: number,
  ): Promise<string> {
    const key = collection + ':' + listId;
    const id = randomString();
    obj.id = id;
    const value = eJsonStringify(obj);

    const multi = this.redis.multi().hsetnx(key, id, value);
    if (expire) {
      multi.expire(key, expire);
    }
    const results = await multi.exec();
    if (results[0]) {
      return id;
    } else {
      throw new Error('List entry already exists');
    }
  }

  async getListEntryById<T>(collection: string, listId: string, id: string): Promise<T> {
    const key = collection + ':' + listId;
    const rawResult = await this.redis.hget(key, id);
    if (rawResult) {
      return eJsonParse(rawResult);
    } else {
      return undefined;
    }
  }

  async updateListEntry(collection: string, listId: string, id: string, obj: Record<string, any>): Promise<void> {
    const key = collection + ':' + listId;
    await this.redis.hset(key, id, eJsonStringify(obj));
  }

  async removeListEntry(collection: string, listId: string, id: string): Promise<void> {
    const key = collection + ':' + listId;
    await this.redis.hdel(key, id);
  }

  async updateExpiry(collection: string, id: string, expire: number) {
    const key = collection + ':' + id;
    await this.redis.expire(key, expire);
  }

  async getListEntries<T>(collection: string, listId: string): Promise<T[]> {
    const key = collection + ':' + listId;
    const result = await this.redis.hgetall(key);
    if (result) {
      return Object.values(result) as unknown as T[];
    } else {
      return [];
    }
  }

  async deleteAll() {
    await this.redis.flushdb();
  }
}

export function hmsetTransformer(args: any[]): any[] {
  if (args.length === 2) {
    if (typeof args[1] === 'object' && args[1] !== null) {
      const obj = args[1];
      return [args[0], ...Object.keys(obj).flatMap((key) => [key, eJsonStringify(obj[key])])];
    }
  }
  return args;
}

export function hgetallTransformer(result: string[]) {
  if (Array.isArray(result)) {
    if (result.length === 0) {
      return undefined;
    }
    const data = {};
    for (let i = 0; i < result.length; i += 2) {
      const value = result[i + 1];
      data[result[i]] = value.length ? eJsonParse(value) : undefined;
    }
    return data;
  }
  return result;
}

IORedis.Command.setArgumentTransformer('hmset', hmsetTransformer);
IORedis.Command.setReplyTransformer('hgetall', hgetallTransformer);
