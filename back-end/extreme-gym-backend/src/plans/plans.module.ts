import { Module } from '@nestjs/common';
import { PlanService } from './plans.service';
import { PlanController } from './plans.controller';

@Module({
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlansModule {}
