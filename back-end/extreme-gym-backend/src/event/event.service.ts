import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Event } from './entities/event.entity'

@Injectable()
export class EventService {
  private readonly eventRepository: Repository<Event>;
  private readonly logger = new Logger(EventService.name);

  constructor(private dataSource: DataSource) {
    this.eventRepository = this.dataSource.getRepository(Event);
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    try {
      return await this.eventRepository.save(createEventDto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.logger.error(
          `Error al crear el evento: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException('Datos de evento inválidos');
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
      return await this.eventRepository.find();
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
      const event = await this.eventRepository.findOne({ where: { id } });
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
    try {
      const event = await this.getEventById(id);
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
      event.isCancelled = true; // Cambiado a true para cancelar el evento
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
