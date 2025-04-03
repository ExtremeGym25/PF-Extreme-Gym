import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { Notification } from '../notifications/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { GeolocationService } from 'src/geolocation/geolocation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      User,
      Booking,
      User,
      MailerModule,
      Notification,
    ]),
    UsersModule,
    FileUploadModule,
    NotificationsModule,
  ],
  controllers: [EventController],
  providers: [EventService, NotificationsModule, GeolocationService],
  exports: [EventService],
})
export class EventModule {}
