import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { PlansModule } from 'src/plans/plans.module';
import { Event } from 'src/event/entities/event.entity';
import { Account } from 'src/auth/entities/account.entity';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Account,Event]),
    FileUploadModule,
    NotificationsModule,
    PlansModule,
    StripeModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
