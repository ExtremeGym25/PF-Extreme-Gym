import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async createComment(
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      userId,
    });
    return this.commentsRepository.save(comment);
  }

  async getCommentsByPublicationId(publicationId: string): Promise<any[]> {
    const comentarios = await this.commentsRepository.find({ 
      where: { publication: { id: publicationId } },
    relations: ['user'], });

    return comentarios.map((coment) => ({
      id: coment.id,
      content: coment.content,
      date: coment.date,
      publicationId: coment.publicationId,
      user: coment.user.name,
    }))
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Commentario con ID ${id} no entontrado`);
    }
    this.commentsRepository.merge(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async deleteComment(id: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Commentario con ID ${id} no encontrado`);
    }
    await this.commentsRepository.remove(comment);
  }
}
