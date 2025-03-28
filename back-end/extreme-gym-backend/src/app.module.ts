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
import { ChatBotModule } from './chat-bot/chat-bot.module';
import { ChatModule } from './chat/chat.module';
import { CommunityModule } from './community/community.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import typeormConfig from './config/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { adminModule } from './admin/admin.module';
import { ChatGateway } from './chat/chat.gateway';
import { ExpirationTask } from './plans/expiration.task';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CommunityModule,
    ChatModule,
    ChatBotModule,
    FileUploadModule,
    EventModule,
    TrainingRouteModule,
    NotificationsModule,
    BookingsModule,
    PlansModule,
    PaymentsModule,
    adminModule,

    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('typeorm') || {};
        console.log('📡 Intentando conectar a la base de datos...');
        return dbConfig;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ExpirationTask],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    console.log('✅ Módulo iniciado correctamente.');
    console.log(
      '🔗 Configuración actual de la BD:',
      this.configService.get('typeorm'),
    );
  }
}
