import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';


@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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

    // 💡 Aquí logueamos el tipo de evento recibido
    this.stripeService['logger'].log(`📨 Webhook recibido: ${event.type}`);
  } catch (err) {
    console.error('❌ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ⛳ Delegamos el evento al servicio
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
        planId,
        customerId,
      );

      // Puedes agregar la lógica para actualizar tu base de datos con la suscripción y el plan

      res.status(200).json(subscription);
    } catch (err) {
      console.error('Error creating subscription:', err);
      res.status(500).json({ error: err.message });
    }
  }
  @Post('create-checkout-session')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea una sesión de Stripe Checkout para suscribirse',
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout URL creada exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario ya tiene una suscripción activa.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al crear la sesión de checkout.',
  })
  async createCheckoutSession(
    @Body() body: { priceId: string; customerId: string },
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.id;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      if (user.subscriptionType === 'premium') {
        return res.status(403).json({
          error: 'Ya tienes una suscripción activa. No puedes adquirir otra.',
        });
      }
  
      const session = await this.stripeService.createCheckoutSession(
        body.customerId,
        body.priceId,
      );
  
      return res.status(200).json({ checkoutUrl: session.url });
    } catch (err) {
      console.error('Error creating Checkout session:', err);
      return res.status(500).json({ error: err.message });
    }
  }
}
