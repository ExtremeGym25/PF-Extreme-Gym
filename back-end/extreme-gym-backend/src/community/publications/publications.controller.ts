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
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('publications')
@UseGuards(AuthGuard)
export class PublicationsController {
  constructor(
    private readonly publicationsService: PublicationsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createPublication(
    @Request() req: any,
    @Body() createPublicationDto: CreatePublicationDto,
  ) {
    const user = await this.usersService.findOne(req.user.id);
    return this.publicationsService.createPublication(
      user.id,
      createPublicationDto,
    );
  }

  @Get()
  async getPublications() {
    return this.publicationsService.getPublications();
  }

  @Get(':id')
  async getPublicationById(@Param('id') id: string) {
    return this.publicationsService.getPublicationById(id);
  }

  @Put(':id')
  async updatePublication(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationsService.updatePublication(id, updatePublicationDto);
  }

  @Delete(':id')
  async deletePublication(@Param('id') id: string) {
    return this.publicationsService.deletePublication(id);
  }
}
