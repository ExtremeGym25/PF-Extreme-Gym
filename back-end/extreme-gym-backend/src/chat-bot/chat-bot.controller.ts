import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { CreateChatBotDto } from './dto/create-chat-bot.dto';
import { UpdateChatBotDto } from './dto/update-chat-bot.dto';

@Controller('chat-bot')
export class ChatBotController {
  constructor(private readonly chatBotService: ChatBotService) {}

  @Post()
  create(@Body() createChatBotDto: CreateChatBotDto) {
    return this.chatBotService.create(createChatBotDto);
  }

  @Get()
  findAll() {
    return this.chatBotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatBotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatBotDto: UpdateChatBotDto) {
    return this.chatBotService.update(+id, updateChatBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatBotService.remove(+id);
  }
}
