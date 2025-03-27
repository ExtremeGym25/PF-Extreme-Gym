import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './plans.controller';
import { PlanService } from './plans.service';
import { Plan } from './entities/plan.entity';
import { UserPlan } from './entities/user-plan.entity';
import { User } from '../users/entities/user.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      UserPlan,
      User,
      Notification,
      MailerModule,
    ]),
    NotificationsModule,
  ],
  controllers: [PlanController],
  providers: [PlanService, NotificationsModule],
  exports: [PlanService],
})
export class PlansModule {}
