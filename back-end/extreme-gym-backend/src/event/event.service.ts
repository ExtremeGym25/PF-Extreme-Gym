import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto, ExtremeSportCategory } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { Event } from './entities/event.entity'
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,
    file: Express.Multer.File,
  ): Promise<Event> {
    if (
      !Object.values(ExtremeSportCategory).includes(createEventDto.category)
    ) {
      throw new BadRequestException('Categoría de evento inválida');
    }

    const user = await this.userService.findOne(createEventDto.userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    try {
      // Subir la imagen y obtener la URL
      const imageUrl = await this.fileUploadService.uploadImage(file, 'events');

      const event = this.eventRepository.create({
        ...createEventDto,
        user,
        imageUrl,
      });

      const existingEvent = await this.eventRepository.findOne({
        where: { id: event.id },
      });
      if (existingEvent) {
        const existingBookingsCount = await this.bookingRepository.count({
          where: { event: { id: event.id } },
        });
        if (existingBookingsCount >= existingEvent.capacity) {
          throw new BadRequestException('Capacidad del evento superada');
        }
      }
      return await this.eventRepository.save(event);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.logger.error(
          `Error al crear el evento: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException('Datos de evento inválidos');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error inesperado al crear el evento: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('No se pudo crear el evento');
    }
  }

  async getEvents(): Promise<Event[]> {
    try {
      return await this.eventRepository.find({ relations: ['user'] });
    } catch (error) {
      this.logger.error(
        `Error al obtener los eventos: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'No se pudieron obtener los eventos',
      );
    }
  }

  async getEventById(id: string): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!event) {
        throw new NotFoundException(`Evento con ID ${id} no encontrado`);
      }
      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error al obtener el evento: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('No se pudo obtener el evento');
    }
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto, 
    file?: Express.Multer.File,
  ): Promise<Event> {
    const event = await this.getEventById(id);

    if (
      updateEventDto.category &&
      !Object.values(ExtremeSportCategory).includes(updateEventDto.category)
    ) {
      throw new BadRequestException('Categoria de evento invalida');
    }

    try {
      if (file) {
        // Subir nueva imagen y actualizar imageUrl
        const imageUrl = await this.fileUploadService.uploadImage(
          file,
          'events',
        );
        event.imageUrl = imageUrl;
      }

      this.eventRepository.merge(event, updateEventDto);
      return await this.eventRepository.save(event);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof QueryFailedError) {
        this.logger.error(
          `Error al actualizar el evento con ID ${id}: ${error.message}`,
          error.stack,
        );
        throw new BadRequestException('Datos de evento inválidos');
      }
      this.logger.error(
        `Error inesperado al actualizar el evento con ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('No se pudo actualizar el evento');
    }
  }

  async cancelEvent(id: string): Promise<Event> {
    try {
      const event = await this.getEventById(id);
      event.isCancelled = true;
      return await this.eventRepository.save(event);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error al cancelar el evento con ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('No se pudo cancelar el evento');
    }
  }
}
