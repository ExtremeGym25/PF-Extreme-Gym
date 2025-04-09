import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from '../entities/publication.entity';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
  ) {}

  async createPublication(
    userId: string,
    createPublicationDto: CreatePublicationDto,
  ): Promise<Publication> {
    const publication = this.publicationsRepository.create({
      ...createPublicationDto,
      userId,
    });
    return this.publicationsRepository.save(publication);
  }

  async getPublications(): Promise<Publication[]> {
    return this.publicationsRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.user', 'user')
      .select([
        'publication.id',
        'publication.content',
        'publication.date',
        'publication.userId',
        'user.id',
        'user.name',
      ])
      .orderBy('publication.date', 'DESC')
      .getMany();
  }

  async getPublicationById(id: string): Promise<Publication> {
    const publication = await this.publicationsRepository.findOne({
      where: { id },
    });
    if (!publication) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    return publication;
  }

  async updatePublication(
    id: string,
    updatePublicationDto: UpdatePublicationDto,
  ): Promise<any> {
    console.log('dtos recibidos', updatePublicationDto);

    const publication = await this.getPublicationById(id);

    let needsUpdate = false;

    if (
      updatePublicationDto.content !== undefined &&
      updatePublicationDto.content !== publication.content
    ) {
      publication.content = updatePublicationDto.content;
      needsUpdate = true;
    }

    if (
      updatePublicationDto.planId !== undefined &&
      updatePublicationDto.planId !== publication.planId
    ) {
      publication.planId = updatePublicationDto.planId;
      needsUpdate = true;
    }

    if (
      updatePublicationDto.eventId !== undefined &&
      updatePublicationDto.eventId !== publication.eventId
    ) {
      publication.eventId = updatePublicationDto.eventId;
      needsUpdate = true;
    }

    if (needsUpdate) {
      const update = await this.publicationsRepository.save(publication, {
        reload: true,
      });

      return {
        id: update.id,
        content: update.content,
        date: update.date,
        userId: update.userId,
        planId: update.planId,
        eventId: update.eventId,
      };
    }

    return {
      id: publication.id,
      content: publication.content,
      date: publication.date,
      userId: publication.userId,
      planId: publication.planId,
      eventId: publication.eventId,
    };
  }

  async deletePublication(id: string): Promise<void> {
    const publication = await this.getPublicationById(id);
    await this.publicationsRepository.remove(publication);
  }

  async getMonthlyPublicationCount(start: Date, end: Date): Promise<any[]> {
    const monthlyPublications = await this.publicationsRepository
      .createQueryBuilder('publication')
      .select('COUNT(publication.id)', 'count')
      .addSelect("TO_CHAR(publication.date, 'YYYY-MM')", 'month')
      .where('publication.date >= :start AND publication.date <= :end', {
        start,
        end,
      })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return monthlyPublications.map((item) => ({
      month: item.month, // Devolvemos 'YYYY-MM'
      count: parseInt(item.count, 10),
    }));
  }
}