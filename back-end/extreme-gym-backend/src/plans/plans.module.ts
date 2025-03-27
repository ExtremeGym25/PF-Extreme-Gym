import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './plans.controller';
import { PlanService } from './plans.service';
import { Plan } from './entities/plan.entity';
import { UserPlan } from './entities/user-plan.entity';
import { User } from '../users/entities/user.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, UserPlan, User, Notification])],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlansModule {}
