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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
@ApiBearerAuth()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo comentario' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comentario creado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async createComment(
    @Request() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = req.user.id;
    return this.commentsService.createComment(userId, createCommentDto);
  }

  @Get('publication/:publicationId')
  @ApiOperation({ summary: 'Obtener comentarios por ID de publicación' })
  @ApiParam({
    name: 'publicationId',
    type: 'string',
    description: 'ID de la publicación',
  })
  @ApiResponse({ status: 200, description: 'Lista de comentarios.' })
  async getCommentsByPublicationId(
    @Param('publicationId') publicationId: string,
  ) {
    return this.commentsService.getCommentsByPublicationId(publicationId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un comentario por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID del comentario' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Comentario actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado.' })
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un comentario por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID del comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario eliminado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado.' })
  async deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }
}
