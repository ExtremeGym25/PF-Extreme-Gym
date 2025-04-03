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
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/users/entities/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@Controller('events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los eventos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos recuperada correctamente.',
  })
  async findAllEvents(): Promise<Event[]> {
    return this.eventService.getEvents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento por ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID del evento' })
  @ApiResponse({ status: 200, description: 'Evento encontrado.' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  async findOneEvent(@Param('id') id: string): Promise<Event> {
    try {
      return await this.eventService.getEventById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al crear el evento.' })
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    try {
      return await this.eventService.createEvent(createEventDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar un evento por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del evento a actualizar',
  })
  @ApiBody({ type: UpdateEventDto }) // Asegúrate de que UpdateEventDto está correctamente definido
  @ApiResponse({ status: 200, description: 'Evento actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    try {
      return await this.eventService.updateEvent(id, updateEventDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/upload-image')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Actualizar la imagen de un evento por ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID del evento' })
  @ApiResponse({
    status: 200,
    description: 'Imagen del evento actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  @ApiResponse({
    status: 400,
    description: 'Error al actualizar la imagen del evento.',
  })
  async updateEventImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Event> {
    try {
      return await this.eventService.updateEventImageUrl(id, file);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Eliminar un evento por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del evento a eliminar',
  })
  @ApiResponse({ status: 200, description: 'Evento eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  async cancel(@Param('id') id: string): Promise<Event> {
    try {
      return await this.eventService.cancelEvent(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}  
