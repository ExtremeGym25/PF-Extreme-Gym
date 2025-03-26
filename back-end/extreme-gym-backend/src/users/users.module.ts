import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'src/payments/entities/payment.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Subscription]),
    FileUploadModule,
    NotificationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
