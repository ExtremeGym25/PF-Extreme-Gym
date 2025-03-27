import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Crear una nueva reserva
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      return await this.bookingsService.createBooking(createBookingDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener todas las reservas
  @Get()
  async findAll(): Promise<Booking[]> {
    return await this.bookingsService.findAllBookings();
  }

  // Obtener una reserva por ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    try {
      return await this.bookingsService.findBookingById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.NOT_FOUND,
      );
    }
  }

  // Actualizar una reserva
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    try {
      return await this.bookingsService.updateBooking(id, updateBookingDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar una reserva
  @Delete(':id')
  async cancel(@Param('id') id: string): Promise<void> {
    try {
      await this.bookingsService.cancelBooking(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
