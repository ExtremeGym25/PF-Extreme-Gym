import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { PlansModule } from './plans/plans.module';
import { BookingsModule } from './bookings/bookings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TrainingRouteModule } from './training-route/training-route.module';
import { EventModule } from './event/event.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MultimediaModule } from './multimedia/multimedia.module';
import { ChatBotModule } from './chat-bot/chat-bot.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notifications/notifications.module';
import { PayModule } from './pay/pay.module';
import { CommunityModule } from './community/community.module';
import { TrainingPlanModule } from './training-plan/training-plan.module';
import { ClassModule } from './class/class.module';
import { ClaseModule } from './clase/clase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users/users.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule, ClaseModule, ClassModule, TrainingPlanModule, CommunityModule, PayModule, NotificationModule, ChatModule, ChatBotModule, MultimediaModule, FileUploadModule, EventModule, TrainingRouteModule, NotificationsModule, BookingsModule, PlansModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
