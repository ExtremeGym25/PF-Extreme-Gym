import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Event } from 'src/event/entities/event.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  // Crear una reserva
  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const user = await this.userRepository.findOne({
      where: { id: createBookingDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const event = await this.eventRepository.findOne({
      where: { id: createBookingDto.eventId },
    });
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    // Verificar si el usuario ya tiene una reserva para este evento
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

    // Calcular el número total de personas reservadas
    const totalPeopleBooked = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.numberOfPeople)', 'totalPeople')
      .where('booking.eventId = :eventId', {
        eventId: createBookingDto.eventId,
      })
      .getRawOne()
      .then((result) => parseInt(result?.totalPeople || '0'));

    // Verificar la capacidad del evento
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
    console.log(booking);

    return await this.bookingRepository.save(booking);
  }

  // Obtener todas las reservas
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

  async cancelBooking(id: string): Promise<void> {
    const booking = await this.findBookingById(id);
    booking.isCancelled = true;
    await this.bookingRepository.save(booking);
  }
}
