import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createComment(
    @Request() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user = await this.usersService.findOne(req.user.id);
    return this.commentsService.createComment(user.id, createCommentDto);
  }

  @Get('publication/:publicationId')
  async getCommentsByPublicationId(
    @Param('publicationId') publicationId: string,
  ) {
    return this.commentsService.getCommentsByPublicationId(publicationId);
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }
}
