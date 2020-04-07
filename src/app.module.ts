import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstimationService } from './estimate/estimation/estimation.service';
import { ConfigModule } from '@nestjs/config';
import { MongodbService } from './mongodb/mongodb.service';
import { EstimateGateway } from './estimate/estimate.gateway';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    EstimationService,
    MongodbService,
    MongodbService.dbProvider,
    EstimateGateway,
    RedisService,
    RedisService.redisProvider,
  ],
})
export class AppModule {}
