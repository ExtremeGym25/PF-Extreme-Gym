import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      User,
      Event,
      Notification,
    ]),
    NotificationsModule,
    MailerModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, NotificationsModule],
  exports: [BookingsService],
})
export class BookingsModule {}
