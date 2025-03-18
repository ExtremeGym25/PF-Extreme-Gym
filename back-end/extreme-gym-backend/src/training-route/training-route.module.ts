import { Module } from '@nestjs/common';
import { TrainingRouteService } from './training-route.service';
import { TrainingRouteController } from './training-route.controller';

@Module({
  controllers: [TrainingRouteController],
  providers: [TrainingRouteService],
})
export class TrainingRouteModule {}
