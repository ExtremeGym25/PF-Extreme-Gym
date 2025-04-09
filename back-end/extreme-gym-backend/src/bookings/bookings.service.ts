import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Event } from 'src/event/entities/event.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getMonthlyUsersWithReservations(
    start: Date,
    end: Date,
  ): Promise<any[]> {
    const monthlyUsersWithReservations = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('COUNT(DISTINCT booking.userId)', 'count')
      .addSelect("TO_CHAR(booking.bookingsDate, 'YYYY-MM')", 'month')
      .where(
        'booking.bookingsDate >= :start AND booking.bookingsDate <= :end',
        { start, end },
      )
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return monthlyUsersWithReservations.map((item) => ({
      month: item.month, // Devolvemos 'YYYY-MM'
      reservations: parseInt(item.count, 10),
      count: parseInt(item.count, 10),
    }));
  }

  // Crear una reserva
  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const user = await this.userRepository.findOne({
      where: { id: createBookingDto.userId },
      relations: ['plans'],
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const now = new Date();
    const hasActiveSubscription =
      user.subscriptionType === 'premium' && // Verificar el tipo de suscripción directamente
      user.subscriptionExpirationDate &&
      new Date(user.subscriptionExpirationDate) > now;

    if (!hasActiveSubscription) {
      throw new BadRequestException(
        'El usuario debe tener una suscripción Premium activa para crear una reserva.',
      );
    }

    const event = await this.eventRepository.findOne({
      where: { id: createBookingDto.eventId },
    });
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        user: { id: createBookingDto.userId },
        event: { id: createBookingDto.eventId },
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'El usuario ya tiene una reserva para este evento',
      );
    }

    const totalPeopleBooked = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.numberOfPeople)', 'totalPeople')
      .where('booking.eventId = :eventId', {
        eventId: createBookingDto.eventId,
      })
      .getRawOne()
      .then((result) => parseInt(result?.totalPeople || '0'));

    if (totalPeopleBooked + createBookingDto.numberOfPeople > event.capacity) {
      throw new BadRequestException(
        'La cantidad total de personas reservadas excede la capacidad del evento',
      );
    }

    const booking = this.bookingRepository.create({
      user: user,
      event: event,
      numberOfPeople: createBookingDto.numberOfPeople,
      bookingsDate: new Date(),
    });
    const savedBooking = await this.bookingRepository.save(booking);

    // Envío de notificación (manejado por separado para no afectar la creación)
    this.sendBookingConfirmation(savedBooking).catch((error) => {
      this.logger.error('Error enviando notificación:', error);
    });

    return savedBooking;
  }

  //  metodo privado para enviar la notiifcacion de reserva
  private async sendBookingConfirmation(booking: Booking): Promise<void> {
    try {
      await this.notificationsService.sendBookingConfirmation({
        userEmail: booking.user.email,
        userName: booking.user.name,
        eventName: booking.event.name,
        eventDate: booking.event.date,
        eventTime: booking.event.time,
        eventLocation: booking.event.location,
        numberOfPeople: booking.numberOfPeople,
      });
      this.logger.log(`Notificación enviada a ${booking.user.email}`);
    } catch (error) {
      this.logger.error(`Error enviando notificación: ${error.message}`);
      throw error;
    }
  }

  async findAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find({ relations: ['user', 'event'] });
  }

  async findBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    if (!booking) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }
    return booking;
  }

  async updateBooking(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findBookingById(id);

    if (updateBookingDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateBookingDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      booking.user = user;
    }

    if (updateBookingDto.eventId) {
      const event = await this.eventRepository.findOne({
        where: { id: updateBookingDto.eventId },
      });
      if (!event) {
        throw new NotFoundException('Evento no encontrado');
      }
      booking.event = event;
    }

    if (updateBookingDto.numberOfPeople !== undefined) {
      booking.numberOfPeople = updateBookingDto.numberOfPeople;
    }

    return await this.bookingRepository.save(booking);
  }

  async findBookingsByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['event'],
    });

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException(
        `No hay reservas para el usuario con ID ${userId}`,
      );
    }

    return bookings;
  }
  async cancelBooking(id: string): Promise<void> {
    const booking = await this.findBookingById(id);
    booking.isCancelled = true;
    await this.bookingRepository.save(booking);
  }
}
