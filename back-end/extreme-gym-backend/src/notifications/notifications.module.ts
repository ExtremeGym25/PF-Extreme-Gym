import { Module, Logger } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as path from 'path';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Booking]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"Extreme Gym" <${config.get<string>('SMTP_USER')}>`,
        },
        template: {
          dir: path.join(process.cwd(), 'src', 'notifications', 'templates'), // Asegúrate de que esta ruta existe
          adapter: new HandlebarsAdapter(), // CORREGIDO: Ahora usa la importación correcta
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, Logger],
  exports: [NotificationsService],
})
export class NotificationsModule {}
