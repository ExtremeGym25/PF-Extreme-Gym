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
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileUpload } from 'src/file-upload/entities/file-upload.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      UserPlan,
      User,
      MailerModule,
      Notification,
      FileUpload
    ]),
    NotificationsModule,
    FileUploadModule,
  ],
  controllers: [PlanController],
  providers: [PlanService, NotificationsModule, FileUploadService],
  exports: [PlanService],
})
export class PlansModule {}
