import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAllEvents(): Promise<Event[]> {
    return this.eventService.getEvents();
  }

  @Get(':id')
  async findOneEvent(@Param('id') id: string): Promise<Event> {
    return this.eventService.getEventById(id);
  }

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.createEvent(createEventDto);
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  async cancel(@Param('id') id: string): Promise<Event> {
    return this.eventService.cancelEvent(id);
  }
}
