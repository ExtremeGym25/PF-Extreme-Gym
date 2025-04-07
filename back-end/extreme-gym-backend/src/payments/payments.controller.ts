import {
  Controller,
  Post,
  Param,
  Body,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/users/entities/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Endpoint para asignar el plan Premium mensual a un usuario
  @Post('assign-premium-monthly/:userId')
  @ApiOperation({ summary: 'Asignar plan Premium mensual a un usuario' })
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Plan Premium mensual asignado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al asignar el plan Premium mensual.',
  })
  async assignPremiumMonthly(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<User> {
    try {
      // Asigna el plan Premium mensual al usuario
      const updatedUser = await this.paymentsService.assignPremiumMonthlyPlan(
        userId,
        req.user,
      );
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
  @ApiOperation({ summary: 'Asignar plan Premium anual a un usuario' })
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Plan Premium anual asignado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al asignar el plan Premium anual.',
  })
  async assignPremiumYearly(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<User> {
    try {
      // Asigna el plan Premium anual al usuario
      const updatedUser = await this.paymentsService.assignPremiumYearlyPlan(
        userId,
        req.user,
      );
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        `Error asignando el plan Premium anual: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('subscribe/monthly/:userId')
  @ApiOperation({ summary: 'Activar suscripción mensual para un usuario' })
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Suscripción mensual activada correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async subscribeMonthly(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Request() req: any,
  ) {
    try {
      const user = await this.paymentsService.assignPremiumMonthlyPlan(
        userId,
        req.user,
      );
      return {
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Suscripción mensual activada',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            plan: user.plan?.name || 'Sin plan',
            expirationDate: user.subscriptionExpirationDate,
          },
        },
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message || 'Error al procesar suscripción mensual',
        data: null,
      };
    }
  }

  // ✅ Prueba la suscripción anual
  @Post('subscribe/yearly/:userId')
  @ApiOperation({ summary: 'Activar suscripción anual para un usuario' })
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Suscripción anual activada correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async subscribeYearly(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Request() req: any,
  ) {
    try {
      const user = await this.paymentsService.assignPremiumYearlyPlan(
        userId,
        req.user,
      );
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
    } catch (error) {
      throw new HttpException(
        `Error activando la suscripción anual: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
