import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as IORedis from 'ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  readonly redisUri: string;
  readonly redis: Redis;

  constructor(configService: ConfigService) {
    this.redisUri = configService.get<string>('REDIS_URI');
    this.redis = new IORedis(this.redisUri);
  }

  static redisProvider = {
    provide: 'REDIS',
    useFactory: async (redisService: RedisService) => {
      return redisService.redis;
    },
    inject: [RedisService],
  };

  onApplicationShutdown(): any {
    this.redis.disconnect();
  }
}
