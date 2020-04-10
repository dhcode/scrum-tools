import { Module } from '@nestjs/common';
import { EstimationService } from './estimation/estimation.service';
import { EstimationSessionResolver } from './resolvers/estimation-session.resolver';
import { RedisModule } from '../redis/redis.module';
import { EstimationTopicResolver } from './resolvers/estimation-topic.resolver';

@Module({
  imports: [RedisModule],
  providers: [EstimationService, EstimationSessionResolver, EstimationTopicResolver],
})
export class EstimateModule {}
