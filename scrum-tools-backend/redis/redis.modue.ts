import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [RedisService, RedisService.redisProvider],
  exports: [RedisService],
})
export class RedisModule {}
