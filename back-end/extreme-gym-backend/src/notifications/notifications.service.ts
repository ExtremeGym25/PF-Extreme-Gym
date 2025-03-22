import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

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
