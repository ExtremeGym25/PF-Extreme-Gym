import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { CreateChatBotDto } from './dto/create-chat-bot.dto';
import { UpdateChatBotDto } from './dto/update-chat-bot.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/users/entities/roles.enum';

@ApiTags('Chat Bot')
@Controller('chat-bot')
export class ChatBotController {
  constructor(private readonly chatBotService: ChatBotService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo Chat Bot' })
  @ApiResponse({ status: 201, description: 'Chat Bot creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requiere rol de Administrador.',
  })
  @Roles(Role.Admin)
  create(@Body() createChatBotDto: CreateChatBotDto) {
    return this.chatBotService.create(createChatBotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Chat Bots' })
  @ApiResponse({ status: 200, description: 'Lista de Chat Bots.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requiere rol de Administrador.',
  })
  @Roles(Role.Admin)
  findAll() {
    return this.chatBotService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un Chat Bot por su ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID del Chat Bot' })
  @ApiResponse({ status: 200, description: 'Chat Bot encontrado.' })
  @ApiResponse({ status: 404, description: 'Chat Bot no encontrado.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requiere rol de Administrador.',
  })
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.chatBotService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un Chat Bot por su ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID del Chat Bot' })
  @ApiResponse({
    status: 200,
    description: 'Chat Bot actualizado correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Chat Bot no encontrado.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requiere rol de Administrador.',
  })
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateChatBotDto: UpdateChatBotDto) {
    return this.chatBotService.update(+id, updateChatBotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un Chat Bot por su ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID del Chat Bot' })
  @ApiResponse({
    status: 204,
    description: 'Chat Bot eliminado correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Chat Bot no encontrado.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requiere rol de Administrador.',
  })
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.chatBotService.remove(+id);
  }
}
