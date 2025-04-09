import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Event } from '../event/entities/event.entity';
import { StripeService } from '../stripe/stripe.service';
import { PublicationsService } from '../community/publications/publications.service';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly publicationsService: PublicationsService,
    private readonly bookingsService: BookingsService,
    private readonly stripeService: StripeService,
  ) {}

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    console.log('--- Inicio de getStats ---');
    console.log('Fecha actual (now):', now);
    console.log('Inicio del mes (startOfMonth):', startOfMonth);
    console.log('Fin del mes (endOfMonth):', endOfMonth);

    // 1. Cantidad de usuarios registrados mensualmente
    const monthlyRegisteredUsers = await this.userRepository
      .createQueryBuilder('user')
      .select('COUNT(user.id)', 'count')
      .addSelect('TO_CHAR("user"."createdAt", \'YYYY-MM\')', 'month')
      .where('"user"."createdAt" >= :start AND "user"."createdAt" <= :end', {
        start: startOfMonth,
        end: endOfMonth,
      })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    console.log('Raw Monthly Registered Users:', monthlyRegisteredUsers);

    const monthNames = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    const formattedMonthlyUsers = monthlyRegisteredUsers.map((item) => {
      const yearMonth = item.month.split('-');
      const year = parseInt(yearMonth[0], 10);
      const monthIndex = parseInt(yearMonth[1], 10) - 1;
      const monthName = monthNames[monthIndex];

      return {
        month: monthName,
        registered: parseInt(item.count, 10),
        count: parseInt(item.count, 10),
      };
    });

    console.log('Formatted Monthly Users:', formattedMonthlyUsers);

    // 2. Usuarios con suscripción Free y Premium (sin cambios)
    const freeUsersCount = await this.userRepository.count({
      where: { subscriptionType: 'free' },
    });
    const premiumUsersCount = await this.userRepository.count({
      where: { subscriptionType: 'premium' },
    });

    console.log('Free Users Count:', freeUsersCount);
    console.log('Premium Users Count:', premiumUsersCount);

    // 3. Usuarios que reservaron en los eventos de mi aplicación (mensual)
    const monthlyUsersWithReservationsRaw =
      await this.bookingsService.getMonthlyUsersWithReservations(
        startOfMonth,
        endOfMonth,
      );

    console.log(
      'Raw Monthly Users with Reservations:',
      monthlyUsersWithReservationsRaw,
    );

    const formattedMonthlyReservations = monthlyUsersWithReservationsRaw.map(
      (item) => {
        const yearMonth = item.month.split('-');
        const year = parseInt(yearMonth[0], 10);
        const monthIndex = parseInt(yearMonth[1], 10) - 1;
        const monthName = monthNames[monthIndex];

        return {
          month: monthName,
          reservations: parseInt(item.count, 10),
          count: parseInt(item.count, 10),
        };
      },
    );

    console.log(
      'Formatted Monthly Reservations:',
      formattedMonthlyReservations,
    );

    // 4. Ganancia generada por los de la suscripción premium (mensual - ESTIMADO) (sin cambios)
    const premiumMonthlyPrice = 10;
    const ingresosMensualesPremiumEstimado =
      premiumUsersCount * premiumMonthlyPrice;

    console.log(
      'Ingresos Mensuales Premium Estimado:',
      ingresosMensualesPremiumEstimado,
    );

    // 5. Cantidad de publicaciones dentro de la comunidad mensuales (sin cambios - usa PublicationsService)
    const monthlyPublicationsCountRaw =
      await this.publicationsService.getMonthlyPublicationCount(
        startOfMonth,
        endOfMonth,
      );

    console.log('Raw Monthly Publications Count:', monthlyPublicationsCountRaw);

    const formattedMonthlyPublications = monthlyPublicationsCountRaw.map(
      (item) => {
        const yearMonth = item.month.split('-');
        const year = parseInt(yearMonth[0], 10);
        const monthIndex = parseInt(yearMonth[1], 10) - 1; // Adjust to 0-based index
        const monthName = monthNames[monthIndex];

        return {
          month: monthName,
          count: parseInt(item.count, 10),
        };
      },
    );

    console.log(
      'Formatted Monthly Publications:',
      formattedMonthlyPublications,
    );
    console.log('--- Fin de getStats ---');

    return {
      totalUsuarios: await this.userRepository.count(),
      usuariosRegistradosMensual: formattedMonthlyUsers,
      usuariosFree: freeUsersCount,
      usuariosPremium: premiumUsersCount,
      reservasMensuales: formattedMonthlyReservations,
      ingresosMensualesPremiumEstimado: ingresosMensualesPremiumEstimado,
      publicacionesMensuales: formattedMonthlyPublications,
    };
  }
}
