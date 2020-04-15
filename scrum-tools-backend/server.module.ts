import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { EstimateModule } from './estimate/estimate.module';
import { RedisModule } from './redis/redis.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({ autoSchemaFile: 'scrum-tools-api/schema.graphql', installSubscriptionHandlers: true }),
    RedisModule,
    EstimateModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'scrum-tools-ui/dist/scrum-tools-ui'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class ServerModule {}
