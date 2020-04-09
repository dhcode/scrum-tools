import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { EstimateModule } from './estimate/estimate.module';
import { RedisModule } from './redis/redis.modue';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({ autoSchemaFile: true, installSubscriptionHandlers: true }),
    RedisModule,
    EstimateModule,
  ],
  controllers: [],
  providers: [],
})
export class ServerModule {}
