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
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User as UserDecorator } from '../decorators/user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/users/entities/roles.enum';
import { User } from 'src/users/entities/user.entity';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAll(): Promise<Booking[]> {
    return await this.bookingsService.findAllBookings();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
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

  @Get('my-reservations')
  async findMyReservations(@UserDecorator() user: User): Promise<Booking[]> {
    return await this.bookingsService.findBookingsByUserId(user.id);
  }

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
