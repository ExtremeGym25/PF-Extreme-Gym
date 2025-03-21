import { Controller, Post, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { User } from 'src/users/entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Endpoint para asignar el plan Premium mensual a un usuario
  @Post('assign-premium-monthly/:userId')
  async assignPremiumMonthly(
    @Param('userId') userId: string,
  ): Promise<User> {
    try {
      // Asigna el plan Premium mensual al usuario
      const updatedUser = await this.paymentsService.assignPremiumMonthlyPlan(userId);
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        `Error asignando el plan Premium mensual: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Endpoint para asignar el plan Premium anual a un usuario
  @Post('assign-premium-yearly/:userId')
  async assignPremiumYearly(
    @Param('userId') userId: string,
  ): Promise<User> {
    try {
      // Asigna el plan Premium anual al usuario
      const updatedUser = await this.paymentsService.assignPremiumYearlyPlan(userId);
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        `Error asignando el plan Premium anual: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}