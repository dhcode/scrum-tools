import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { EstimateModule } from './estimate/estimate.module';
import { RedisModule } from './redis/redis.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'scrum-tools-ui/dist/scrum-tools-ui'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'scrum-tools-api/schema.graphql',
      installSubscriptionHandlers: true,
    }),
    RedisModule,
    EstimateModule,
  ],
  controllers: [],
  providers: [],
})
export class ServerModule {}
