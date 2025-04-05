import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Subscription } from 'src/payments/entities/payment.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { requiresAuth } from 'express-openid-connect';
import { Account } from './entities/account.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Account, Subscription]),
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requiresAuth()).forRoutes('auth/auth0/protected');
  }
}
