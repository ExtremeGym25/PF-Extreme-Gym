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
      'user.name' 
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
  ): Promise<Publication> {
    const publication = await this.getPublicationById(id);
    this.publicationsRepository.merge(publication, updatePublicationDto);
    return this.publicationsRepository.save(publication);
  }

  async deletePublication(id: string): Promise<void> {
    const publication = await this.getPublicationById(id);
    await this.publicationsRepository.remove(publication);
  }
}
