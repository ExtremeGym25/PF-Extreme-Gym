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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas recuperada exitosamente.',
  })
  async findAll(): Promise<Booking[]> {
    return await this.bookingsService.findAllBookings();
  }

  @Get('my-reservations')
  @ApiOperation({ summary: 'Obtener las reservas del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas del usuario recuperada exitosamente.',
  })
  async findMyReservations(@UserDecorator() user: User): Promise<Booking[]> {
    return await this.bookingsService.findBookingsByUserId(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
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

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al crear la reserva.' })
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
  @ApiOperation({ summary: 'Actualizar una reserva por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la reserva a actualizar',
  })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
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
  @ApiOperation({ summary: 'Eliminar una reserva por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la reserva a eliminar',
  })
  @ApiResponse({ status: 204, description: 'Reserva eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
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
