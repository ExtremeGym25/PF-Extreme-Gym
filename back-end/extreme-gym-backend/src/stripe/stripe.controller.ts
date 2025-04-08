import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  @ApiOperation({
    summary:
      'Endpoint para recibir eventos webhook de Stripe. **Importante: Requiere validación de firma.**',
  })
  @ApiResponse({ status: 200, description: 'Evento recibido y procesado.' })
  @ApiResponse({ status: 400, description: 'Error en la firma del webhook.' })
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    let event;
    try {
      event = this.stripeService.constructEvent(req.body, sig);
    } catch (err) {
      console.error('❌ Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Delegamos el evento a StripeService
    await this.stripeService.handleEvent(event);

    res.json({ received: true });
  }

  @Post('subscribe')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una suscripción de Stripe para un cliente' })
  @ApiResponse({ status: 200, description: 'Suscripción creada exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Error al crear la suscripción.' })
  async subscribe(
    @Body() body: { customerId: string; planId: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { planId, customerId } = body;

      const subscription = await this.stripeService.createSubscription(
        customerId,
        planId,
      );

      // Puedes agregar la lógica para actualizar tu base de datos con la suscripción y el plan

      res.status(200).json(subscription);
    } catch (err) {
      console.error('Error creating subscription:', err);
      res.status(500).json({ error: err.message });
    }
  }
}
