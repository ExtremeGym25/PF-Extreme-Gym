import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '¡Bienvenido a Extreme Gym! 🏋️‍♂️',
        template: './welcome', // Se busca en la carpeta `templates`
        context: { name }, // Variables para la plantilla
      });
      return { message: 'Correo enviado con éxito' };
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
