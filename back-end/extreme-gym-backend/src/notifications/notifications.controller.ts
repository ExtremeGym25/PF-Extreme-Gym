import { Controller, Post, Body, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-welcome')
  async sendWelcomeEmail(
    @Body('email') email: string,
    @Body('name') name: string,
  ) {
    return this.notificationsService.sendWelcomeEmail(email, name);
  }

  @Get('test-weekly')
  async testWeeklyEmail() {
    await this.notificationsService.sendWeeklyReminder();
    return { message: 'Correos de prueba enviados' };
  }
}
