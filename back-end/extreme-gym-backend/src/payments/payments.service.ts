import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    await this.seedSubscriptions();
  }

  private async seedSubscriptions() {
    const freePlan = await this.subscriptionRepository.findOne({
      where: { name: 'Free' },
    });
    const premiumPlan = await this.subscriptionRepository.findOne({
      where: { name: 'Premium' },
    });

    if (!freePlan) {
      await this.subscriptionRepository.save({
        name: 'Free',
      });
    }

    if (!premiumPlan) {
      await this.subscriptionRepository.save({
        name: 'Premium',
        pricePerMonth: 9.99,
        pricePerYear: 99.99,
      });
    }
  }

  async assignPremiumMonthlyPlan(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const premiumPlan = await this.subscriptionRepository.findOne({
      where: { name: 'Premium' },
    });

    if (!premiumPlan) {
      throw new Error('Premium plan not found');
    }

    user.plan = premiumPlan;
    user.subscriptionExpirationDate = this.addMonthsToDate(new Date(), 1);

    await this.userRepository.save(user);

    await this.notificationsService.enviarCorreoConfirmacion(
      user.email,
      user.name,
      'Mensual',
      '1 mes',
    );

    return user;
  }

  async assignPremiumYearlyPlan(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const premiumPlan = await this.subscriptionRepository.findOne({
      where: { name: 'Premium' },
    });

    if (!premiumPlan) {
      throw new Error('Premium plan not found');
    }

    user.plan = premiumPlan;
    user.subscriptionExpirationDate = this.addYearsToDate(new Date(), 1);

    await this.userRepository.save(user);
     await this.notificationsService.enviarCorreoConfirmacion(
       user.email,
       user.name,
       'Anual',
       '1 año',
     );

    return user;
  }

  private addMonthsToDate(date: Date, months: number): string {
    date.setMonth(date.getMonth() + months);
    return date.toISOString();
  }

  private addYearsToDate(date: Date, years: number): string {
    date.setFullYear(date.getFullYear() + years);
    return date.toISOString();
  }
}
