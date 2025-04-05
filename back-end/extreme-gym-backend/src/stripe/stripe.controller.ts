import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
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
  async subscribe(@Body() body: { customerId: string; planId: string }, @Res() res: Response) {
    try {
      const { planId , customerId} = body; 
      
const subscription = await this.stripeService.createSubscription( customerId ,planId);
      

      // Puedes agregar la lógica para actualizar tu base de datos con la suscripción y el plan

      res.status(200).json(subscription);
    } catch (err) {
      console.error('Error creating subscription:', err);
      res.status(500).json({ error: err.message });
    }
  }
}
