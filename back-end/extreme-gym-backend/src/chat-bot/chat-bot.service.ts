import { Injectable } from '@nestjs/common';
import { CreateChatBotDto } from './dto/create-chat-bot.dto';
import { UpdateChatBotDto } from './dto/update-chat-bot.dto';

@Injectable()
export class ChatBotService {
  create(createChatBotDto: CreateChatBotDto) {
    return 'This action adds a new chatBot';
  }

  findAll() {
    return `This action returns all chatBot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatBot`;
  }

  update(id: number, updateChatBotDto: UpdateChatBotDto) {
    return `This action updates a #${id} chatBot`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatBot`;
  }
}
