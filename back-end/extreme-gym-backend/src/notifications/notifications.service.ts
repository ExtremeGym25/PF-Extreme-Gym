import { Injectable, Inject, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThanOrEqual, Between } from 'typeorm';
import { Event } from '../event/entities/event.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly logger: Logger = new Logger(NotificationsService.name),
  ) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '¡Bienvenido a Extreme Gym! 🏋️‍♂️',
        template: './welcome',
        context: { name },
      });
      return { message: 'Correo enviado con éxito' };
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }

  @Cron('0 7 * * 1')
  async sendWeeklyReminder() {
    console.log('Enviando recordatorios semanales a los usuarios...');

    const users = await this.getUsersToNotify();
    for (const user of users) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: '¡Empieza tu semana con energía en Extreme Gym! 💪',
        template: 'weekly-reminder',
        context: {
          name: user.name,
        },
      });
    }

    console.log('Correos enviados exitosamente.');
  }

  // Obtiene los usuarios desde la base de datos
  private async getUsersToNotify() {
    return await this.usersRepository.find({
      select: ['email', 'name'],
    });
  }

  async enviarCorreoConfirmacion(
    email: string,
    nombre: string,
    tipoPlan: string,
    duracion: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Confirmación de suscripción ${tipoPlan}`,
        template: './confirmacion',
        context: { nombre, tipoPlan, duracion },
      });

      console.log('Correo de confirmación enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el correo de confirmación:', error);
      throw new Error('No se pudo enviar el correo de confirmación');
    }
  }

  async sendSubscriptionExpirationReminder() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const users = await this.usersRepository.find({
      where: {
        subscriptionExpirationDate: LessThanOrEqual(
          nextWeek.toISOString(), // Hasta 7 días adelante
        ),
      },
      relations: ['plan'],
    });

    console.log(`📊 Usuarios encontrados: ${users.length}`);

    if (users.length === 0) {
      console.log('✅ No hay usuarios con suscripción próxima a vencer.');
      return;
    }

    for (const user of users) {
      const expirationDate = new Date(user.subscriptionExpirationDate);
      const daysRemaining = Math.ceil(
        (expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
      );

      const status =
        daysRemaining <= 0 ? 'EXPIRADO' : `POR VENCER (${daysRemaining} días)`;

      console.log('\n══════════════════════════════════════');
      console.log(`📧 Preparando correo para: ${user.email}`);
      console.log(`👤 Nombre: ${user.name}`);
      console.log(
        `📅 Fecha expiración: ${expirationDate.toLocaleDateString('es-ES')}`,
      );
      console.log(`🔄 Estado: ${status}`);
      console.log(`📋 Plan: ${user.plan?.name || 'Sin plan'}`);

      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject:
            daysRemaining <= 0
              ? '❌ Tu suscripción ha expirado'
              : `⚠️ Tu suscripción vence en ${daysRemaining} días`,
          template: 'plan-expiracion',
          context: {
            name: user.name,
            plan: user.plan?.name || 'Premium',
            expirationDate: expirationDate.toLocaleDateString('es-ES'),
            currentYear: new Date().getFullYear(),
            isExpired: daysRemaining <= 0,
            daysRemaining: daysRemaining,
          },
        });
        console.log('✅ Correo enviado con éxito');
      } catch (error) {
        // Log de error
        console.error('❌ Error al enviar correo:', error.message);
      }
    }

    console.log('\n🎉 Proceso de notificación completado');
  }

  async sendPlanAssignmentEmail(email: string, name: string, planName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '¡Te has suscrito a un nuevo plan!',
      template: 'plan-assignment', // Nombre del archivo HBS
      context: {
        name,
        planName,
      },
    });
  }

  //NOTIFICACIONES DE EVENTOS

  async sendNewEventNotification(event: {
    name: string;
    date: Date | string;
    description: string;
    category: string;
    location: string;
  }) {
    try {
      const users = await this.getUsersToNotify();

      // Conversión de fecha en línea
      let eventDate: Date;
      if (event.date instanceof Date && !isNaN(event.date.getTime())) {
        eventDate = event.date;
      } else if (typeof event.date === 'string') {
        eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) {
          this.logger.warn('Fecha inválida, usando fecha actual');
          eventDate = new Date();
        }
      } else {
        eventDate = new Date();
      }

      for (const user of users) {
        try {
          await this.mailerService.sendMail({
            to: user.email,
            subject: '¡Nuevo evento disponible en Extreme Gym! 🎉',
            template: './new-event',
            context: {
              name: user.name,
              eventName: event.name,
              eventDate: eventDate.toLocaleDateString('es-ES'),
              eventDescription: event.description,
              eventCategory: event.category,
              eventLocation: event.location,
            },
          });
        } catch (error) {
          this.logger.error(`Error enviando a ${user.email}: ${error.message}`);
        }
      }

      return { success: true, usersNotified: users.length };
    } catch (error) {
      this.logger.error(`Error general: ${error.message}`);
      throw new Error('No se pudieron enviar las notificaciones');
    }
  }
}
