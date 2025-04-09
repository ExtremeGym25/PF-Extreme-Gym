import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  public readonly logger = new Logger(StripeService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!stripeSecretKey) {
      throw new Error('❌ Stripe Secret Key no está configurada en .env');
    }
    if (!webhookSecret) {
      throw new Error('❌ Stripe Webhook Secret no está configurado en .env');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-03-31.basil',
    });

    this.webhookSecret = webhookSecret;
  }

  // Verifica la firma del evento recibido por el webhook de Stripe
  constructEvent(payload: Buffer, sig: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        sig,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.error(
        `❌ Error verificando firma del webhook: ${err.message}`,
      );
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
  }

  // Maneja eventos de Stripe
  async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event);
        break;
      case 'customer.created':
        await this.handleCustomerCreated(event);
        break;
      case 'customer.updated':
        await this.handleCustomerUpdated(event);
        break;
      case 'payment_method.attached':
        await this.handlePaymentMethodAttached(event);
        break;
      case 'invoice.created':
        await this.handleInvoiceCreated(event);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event);
        break;
    }
  }

  private async handleCustomerUpdated(event: Stripe.Event) {
    const customer = event.data.object as Stripe.Customer;
    // Lógica para manejar actualizaciones de cliente
  }

  private async handlePaymentMethodAttached(event: Stripe.Event) {
    const paymentMethod = event.data.object as Stripe.PaymentMethod;
    // Lógica para manejar el attachment del método de pago
  }

  private async handleInvoiceCreated(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;
    // Lógica para manejar la creación de factura
  }

  // Crea un cliente en Stripe
  async createCustomer(email: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({ email });
  }

  async createSubscription(
    customerId: string,
    planId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
    });
  }

  private async handleCustomerCreated(event: Stripe.Event) {
    const customer = event.data.object as Stripe.Customer;

    // Verificamos si el email es nulo
    if (!customer.email) {
      this.logger.warn(
        '❌ No se proporcionó un email válido para el customer.',
      );
      return;
    }

    // Busca el usuario correspondiente al correo del cliente en Stripe
    const user = await this.userRepository.findOne({
      where: { email: customer.email },
    });

    if (user) {
      user.stripeCustomerId = customer.id; // Asocia el customerId de Stripe al usuario
      await this.userRepository.save(user); // Guarda los cambios
      this.logger.log(`✅ Usuario ${user.email} sincronizado con Stripe.`);
    } else {
      this.logger.warn(
        `⚠️ No se encontró un usuario con el email ${customer.email} para asociar el customerId.`,
      );
    }
  }

  // Maneja pagos exitosos
  private async handleInvoicePaymentSucceeded(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    this.logger.log(
      `📩 Recibido invoice.payment_succeeded para customerId: ${customerId}`,
    );

    if (!customerId) {
      this.logger.error('❌ No se encontró customerId en la factura.');
      return;
    }

    const user = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.warn(
        `⚠️ No se encontró un usuario con el customerId: ${customerId}`,
      );
      return;
    }

    // IDs de los planes en Stripe
    const freePlanPriceId = 'price_1R9Imk2LBi4exdRbWcRfF1Go'; // 🔹 Reemplázalo con el ID de tu plan gratuito
    const premiumMonthlyPriceId = 'price_1R9IJi2LBi4exdRbAqcijuNx';
    const premiumAnnualPriceId = 'price_1R9IJi2LBi4exdRbgq4lADW5';

    // Verificar si el usuario pagó un plan premium
    const isPremium = invoice.lines.data.some(
      (line) =>
        line.pricing?.price_details?.price &&
        [premiumMonthlyPriceId, premiumAnnualPriceId].includes(
          line.pricing.price_details.price,
        ),
    );

    if (isPremium) {
      // 🔹 Obtener la suscripción activa del usuario en Stripe
      const subscriptions = await this.listSubscriptions(customerId);
      const activeSubscription = subscriptions.find(sub => sub.status === 'active');


      if (!activeSubscription) {
        this.logger.warn('❌ No se encontró una suscripción activa.');
        return;
      }
      const subscriptionItem = activeSubscription.items.data[0]; // Suponiendo que hay un solo ítem en la suscripción
      const price = subscriptionItem.price; // Aquí obtenemos el precio, que está relacionado con el plan

      // 🔹 Buscar la suscripción gratuita
      const freeSubscription = subscriptions.find((sub) =>
        sub.items.data.some((item) => item.price.id === freePlanPriceId),
      );

      if (freeSubscription) {
        // 🔥 Cancelar la suscripción gratuita en Stripe
        await this.cancelSubscription(freeSubscription.id);
        this.logger.log(
          `🗑️ Suscripción gratuita ${freeSubscription.id} cancelada.`,
        );
      }
      

       // Calcular la fecha de expiración
       let expirationDate;
       if (price.recurring && price.recurring.interval === 'month') {
         expirationDate = new Date(activeSubscription.billing_cycle_anchor * 1000); // Convertir de segundos a milisegundos
         expirationDate.setMonth(expirationDate.getMonth() + 1); // Sumar 1 mes
       } else if (price.recurring && price.recurring.interval === 'year') {
         expirationDate = new Date(activeSubscription.billing_cycle_anchor * 1000); // Convertir de segundos a milisegundos
         expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Sumar 1 año
       }

      // 🔥 Actualizar usuario a premium en la base de datos
      user.subscriptionType = 'premium';
      user.subscriptionExpirationDate = expirationDate; // Guardar la fecha de expiración
      await this.userRepository.save(user);
      this.logger.log(`✅ Usuario ${user.email} actualizado a premium.`);
    } else {
      this.logger.warn(`⚠️ El usuario ${user.email} sigue en el plan Free.`);
    }
  }

  // 🔍 Obtener todas las suscripciones activas de un cliente en Stripe
  async listSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
    });
    return subscriptions.data;
  }

  // 🗑️ Cancelar una suscripción en Stripe
  async cancelSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  private async handleSubscriptionUpdated(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const status = subscription.status; // Estado de la suscripción

    this.logger.log(
      `📩 Recibido customer.subscription.updated para customerId: ${customerId}, status: ${status}`,
    );

    const user = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.warn(
        `⚠️ No se encontró un usuario con el customerId: ${customerId}`,
      );
      return;
    }

    if (status === 'canceled' || status === 'unpaid' || status === 'past_due') {
      // La suscripción ha expirado o fue cancelada
      user.subscriptionType = 'free'; // Regresar al plan gratuito
      await this.userRepository.save(user);
      this.logger.log(`🔄 Usuario ${user.email} ha vuelto al plan Free.`);
    }
  }
  async createCheckoutSession(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL')}/miPerfil?success=true`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/tarifas?canceled=true`,
    });
  }
}
