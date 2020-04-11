import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [RedisService.redisConnectionProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
