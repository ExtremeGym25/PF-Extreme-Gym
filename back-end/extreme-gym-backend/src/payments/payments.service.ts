import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

   // Seeder que se ejecuta al iniciar la aplicación
  async onModuleInit() {
    await this.seedSubscriptions();
  }

  // Método para insertar los planes Free y Premium si no existen
  private async seedSubscriptions() {
    // Verifica si los planes ya existen, si no, los inserta
    const freePlan = await this.subscriptionRepository.findOne({ where: { name: 'Free' } });
    const premiumPlan = await this.subscriptionRepository.findOne({ where: { name: 'Premium' } });

    // Si el plan Free no existe, lo creamos
    if (!freePlan) {
      await this.subscriptionRepository.save({
        name: 'Free',
      });
    }

    // Si el plan Premium no existe, lo creamos con precios simulados
    if (!premiumPlan) {
      await this.subscriptionRepository.save({
        name: 'Premium',
        pricePerMonth: 9.99, // Precio mensual simulado
        pricePerYear: 99.99, // Precio anual simulado
      });
    }
  }


  // Método para asignar un plan Premium mensual a un usuario
  async assignPremiumMonthlyPlan(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Cambiar al plan Premium y establecer la fecha de expiración
    const premiumPlan = await this.subscriptionRepository.findOne({
      where: { name: 'Premium' },
    });

    if (!premiumPlan) {
      throw new Error('Premium plan not found');
    }

    user.plan = premiumPlan; // Asignar el plan Premium
    user.subscriptionExpirationDate = this.addMonthsToDate(new Date(), 1); // Establecer la fecha de expiración en 1 mes

    await this.userRepository.save(user);

    return user;
  }

  // Método para asignar un plan Premium anual a un usuario
  async assignPremiumYearlyPlan(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Cambiar al plan Premium y establecer la fecha de expiración
    const premiumPlan = await this.subscriptionRepository.findOne({
      where: { name: 'Premium' },
    });

    if (!premiumPlan) {
      throw new Error('Premium plan not found');
    }

    user.plan = premiumPlan; // Asignar el plan Premium
    user.subscriptionExpirationDate = this.addYearsToDate(new Date(), 1); // Establecer la fecha de expiración en 1 año

    await this.userRepository.save(user);

    return user;
  }

  // Método para agregar meses a una fecha
  private addMonthsToDate(date: Date, months: number): string {
    date.setMonth(date.getMonth() + months);
    return date.toISOString(); // Retorna la fecha en formato ISO 8601
  }

  // Método para agregar años a una fecha
  private addYearsToDate(date: Date, years: number): string {
    date.setFullYear(date.getFullYear() + years);
    return date.toISOString(); // Retorna la fecha en formato ISO 8601
  }

}
