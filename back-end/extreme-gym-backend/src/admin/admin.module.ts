import { Module } from '@nestjs/common';
import { AdminService } from './admin.service'; // Importa AdminService
import { AdminController } from './admin.controller'; // Importa AdminController
import { UsersModule } from '../users/users.module';
import { EventModule } from '../event/event.module';
import { CommunityModule } from '../community/community.module';
import { BookingsModule } from '../bookings/bookings.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    UsersModule,
    EventModule,
    BookingsModule,
    StripeModule,
    CommunityModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}