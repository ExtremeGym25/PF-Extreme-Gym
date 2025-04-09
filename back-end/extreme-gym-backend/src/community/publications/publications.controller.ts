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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Publications')
@Controller('publications')
@ApiBearerAuth()
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva publicación' })
  @ApiBody({ type: CreatePublicationDto })
  @ApiResponse({ status: 201, description: 'Publicación creada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async createPublication(
    @Request() req: any,
    @Body() createPublicationDto: CreatePublicationDto,
  ) {
    const userId = req.user.id;
    return this.publicationsService.createPublication(
      userId,
      createPublicationDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las publicaciones' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones.' })
  async getPublications() {
    return this.publicationsService.getPublications();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una publicación por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de la publicación' })
  @ApiResponse({ status: 200, description: 'Publicación encontrada.' })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada.' })
  async getPublicationById(@Param('id') id: string) {
    return this.publicationsService.getPublicationById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una publicación por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de la publicación' })
  @ApiBody({ type: UpdatePublicationDto })
  @ApiResponse({
    status: 200,
    description: 'Publicación actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada.' })
  async updatePublication(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationsService.updatePublication(id, updatePublicationDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una publicación por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de la publicación' })
  @ApiResponse({
    status: 200,
    description: 'Publicación eliminada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada.' })
  async deletePublication(@Param('id') id: string) {
    return this.publicationsService.deletePublication(id);
  }
}
