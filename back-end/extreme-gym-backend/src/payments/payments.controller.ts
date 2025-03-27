import {
  Controller,
  Post,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { User } from 'src/users/entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Endpoint para asignar el plan Premium mensual a un usuario
  @Post('assign-premium-monthly/:userId')
  async assignPremiumMonthly(@Param('userId') userId: string): Promise<User> {
    try {
      // Asigna el plan Premium mensual al usuario
      const updatedUser =
        await this.paymentsService.assignPremiumMonthlyPlan(userId);
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
  async assignPremiumYearly(@Param('userId') userId: string): Promise<User> {
    try {
      // Asigna el plan Premium anual al usuario
      const updatedUser =
        await this.paymentsService.assignPremiumYearlyPlan(userId);
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        `Error asignando el plan Premium anual: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('subscribe/monthly/:userId')
  async subscribeMonthly(@Param('userId') userId: string) {
    const user = await this.paymentsService.assignPremiumMonthlyPlan(userId);
    return {
      message: 'Suscripción anual activada',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan ? user.plan.name : 'Sin plan',
        expirationDate: user.subscriptionExpirationDate,
      },
    };
  }

  // ✅ Prueba la suscripción anual
  @Post('subscribe/yearly/:userId')
  async subscribeYearly(@Param('userId') userId: string) {
    const user = await this.paymentsService.assignPremiumYearlyPlan(userId);

    return {
      message: 'Suscripción anual activada',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan ? user.plan.name : 'Sin plan',
        expirationDate: user.subscriptionExpirationDate,
      },
    };
  }
}
