import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Between } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
        subscriptionExpirationDate: Between(
          today.toISOString(), // Desde ahora
          nextWeek.toISOString(), // Hasta 7 días adelante
        ),
      },
      relations: ['plan'],
    });

    if (users.length === 0) {
      console.log('✅ No hay usuarios con suscripción próxima a vencer.');
      return;
    }

    for (const user of users) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: '⚠️ Tu suscripción está por vencer',
        template: 'plan-expiracion',
        context: {
          nombre: user.name,
          plan: user.plan?.name || 'Desconocido',
          fechaExpiracion: user.subscriptionExpirationDate.split('T')[0], // Solo la fecha
        },
      });

      console.log(
        `✅ Correo enviado a ${user.email} - Expira el ${user.subscriptionExpirationDate}`,
      );
    }
  }
}
