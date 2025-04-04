import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'src/payments/entities/payment.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { PlansModule } from 'src/plans/plans.module';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Subscription, Event]),
    FileUploadModule,
    NotificationsModule,
    PlansModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
