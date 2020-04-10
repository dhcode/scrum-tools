import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { EstimateModule } from './estimate/estimate.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({ autoSchemaFile: 'scrum-tools-api/schema.graphql', installSubscriptionHandlers: true }),
    RedisModule,
    EstimateModule,
  ],
  controllers: [],
  providers: [],
})
export class ServerModule {}
