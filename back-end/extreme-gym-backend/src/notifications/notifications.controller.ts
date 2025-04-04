import { Controller, Post, Body, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-welcome')
  @ApiOperation({ summary: 'Enviar correo de bienvenida a un usuario' })
  @ApiBody({
    description: 'Datos necesarios para enviar un correo de bienvenida',
    type: Object, // Recomiendo crear un DTO específico para este caso.
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        name: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Correo de bienvenida enviado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al enviar el correo de bienvenida.',
  })
  async sendWelcomeEmail(
    @Body('email') email: string,
    @Body('name') name: string,
  ) {
    return this.notificationsService.sendWelcomeEmail(email, name);
  }

  @Get('test-weekly')
  @ApiOperation({
    summary: 'Enviar correos de recordatorio semanales de manera de prueba',
  })
  @ApiResponse({
    status: 200,
    description: 'Correos de recordatorio semanales enviados.',
  })
  async testWeeklyEmail() {
    await this.notificationsService.sendWeeklyReminder();
    return { message: 'Correos de prueba enviados' };
  }

  @Get('test-expiration-reminder')
  @ApiOperation({
    summary: 'Enviar correos de recordatorio de expiración de forma de prueba',
  })
  @ApiResponse({
    status: 200,
    description:
      'Correos de expiración enviados, si había usuarios próximos a expirar.',
  })
  async testExpirationReminder() {
    await this.notificationsService.sendSubscriptionExpirationReminder();
    return {
      message:
        'Correos de expiración enviados (si había usuarios próximos a expirar)',
    };
  }

  // endpoint para enviar recordatorios de reservas
  @Get('test-reminders')
  async testReminders() {
    return this.notificationsService.testReminders();
  }

  
}
