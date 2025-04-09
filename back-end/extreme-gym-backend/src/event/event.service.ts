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
import { Event } from './entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification } from '../notifications/entities/notification.entity';
import { GeolocationService } from '../geolocation/geolocation.service';

@Injectable()
export class EventService {
  findOne(id: string): Event | PromiseLike<Event> {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UsersService,
    private readonly fileUploadService: FileUploadService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private readonly mailService: MailerService,
    private readonly notificationsService: NotificationsService,
    private readonly geolocationService: GeolocationService,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    if (
      !Object.values(ExtremeSportCategory).includes(createEventDto.category)
    ) {
      throw new BadRequestException('Categoría de evento inválida');
    }

    const user = await this.userService.findOne(createEventDto.userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const eventDate = new Date(createEventDto.date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00 para comparar solo la fecha

    if (eventDate < currentDate) {
      throw new BadRequestException(
        'La fecha del evento no puede ser anterior a la fecha actual.',
      );
    }

    let latitude = createEventDto.latitude;
    let longitude = createEventDto.longitude;

    if (!latitude || !longitude) {
      if (createEventDto.location) {
        const coordinates = await this.geolocationService.geocodeAddress(
          createEventDto.location,
        );
        if (coordinates) {
          latitude = coordinates.lat;
          longitude = coordinates.lng;
        } else {
          throw new BadRequestException(
            'No se pudo obtener la geolocalización de la dirección proporcionada.',
          );
        }
      } else {
        throw new BadRequestException(
          'Se requiere latitud y longitud o dirección.',
        );
      }
    }
    try {
      const event = this.eventRepository.create({
        ...createEventDto,
        user: await this.userService.findOne(createEventDto.userId),
        latitude: createEventDto.latitude,
        longitude: createEventDto.longitude,
      });

      // Comprobar capacidad del evento
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
      // Guardar el evento
      const savedEvent = await this.eventRepository.save(event);

      // Enviar notificaciones a todos los usuarios (en segundo plano)
      this.notificationsService
        .sendNewEventNotification(savedEvent)
        .catch((error) => {
          this.logger.error('Error enviando notificaciones de evento:', error);
        });

      return await this.eventRepository.save(event);
    } catch (error) {
      this.handleCreateEventError(error);
      throw new InternalServerErrorException('Error al crear el evento');
    }
  }

  // Actualizar la URL de la imagen del evento
  async updateEventImageUrl(
    eventId: string,
    file: Express.Multer.File,
  ): Promise<Event> {
    const event = await this.getEventById(eventId);

    try {
      // Subir la nueva imagen y obtener la nueva URL
      const imageUrl = await this.fileUploadService.uploadImage(file, 'events');

      // Actualizar la URL de la imagen
      event.imageUrl = imageUrl;
      return await this.eventRepository.save(event);
    } catch (error) {
      this.handleCreateEventError(error);
      throw new InternalServerErrorException('Error al subir la imagen');
    }
  }

  private handleCreateEventError(error: any): void {
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
  ): Promise<Event> {
    const event = await this.getEventById(id);

    if (
      updateEventDto.category &&
      !Object.values(ExtremeSportCategory).includes(updateEventDto.category)
    ) {
      throw new BadRequestException('Categoria de evento invalida');
    }

    let latitude = updateEventDto.latitude;
    let longitude = updateEventDto.longitude;

    if (!latitude || !longitude) {
      if (updateEventDto.location) {
        const coordinates = await this.geolocationService.geocodeAddress(
          updateEventDto.location,
        );
        if (coordinates) {
          latitude = coordinates.lat;
          longitude = coordinates.lng;
        } else {
          throw new BadRequestException(
            'No se pudo obtener la geolocalización de la dirección proporcionada.',
          );
        }
      }
    }

    try {
      this.eventRepository.merge(event, {
        ...updateEventDto,
        latitude,
        longitude,
      });
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
