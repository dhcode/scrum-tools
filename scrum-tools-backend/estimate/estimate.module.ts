import { Module } from '@nestjs/common';
import { EstimationService } from './estimation/estimation.service';
import { EstimateGateway } from './estimate.gateway';
import { EstimationSessionResolver } from './estimation-session.resolver';
import { RedisModule } from '../redis/redis.modue';

@Module({
  imports: [RedisModule],
  providers: [EstimationService, EstimateGateway, EstimationSessionResolver],
})
export class EstimateModule {}
