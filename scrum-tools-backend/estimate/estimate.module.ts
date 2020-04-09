import { Module } from '@nestjs/common';
import { EstimationService } from './estimation/estimation.service';
import { EstimationSessionResolver } from './estimation-session.resolver';
import { RedisModule } from '../redis/redis.modue';

@Module({
  imports: [RedisModule],
  providers: [EstimationService, EstimationSessionResolver],
})
export class EstimateModule {}
