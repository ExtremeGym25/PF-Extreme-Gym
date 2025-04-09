import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadProfilePictureDto } from './dto/upload-profile-picture.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/users/entities/roles.enum';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('File-Upload')
@Controller('upload')
@UseGuards(AuthGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No se ha recibido ningún archivo.');
    }
  }

  private handleError(error: any, action: string): never {
    if (error instanceof BadRequestException) {
      throw error;
    }
    console.error(`Error al ${action}:`, error);
    throw new InternalServerErrorException(
      `Error al ${action}. Intenta nuevamente más tarde.`,
    );
  }

  private buildResponse(message: string, url: string): any {
    return {
      message,
      url,
    };
  }

  @Post('file')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir un archivo' })
  @ApiBody({ type: UploadFileDto })
  @ApiResponse({ status: 200, description: 'Archivo subido exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al subir el archivo.' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() UploadFileDto: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo.');
    }

    if (!UploadFileDto.category) {
      throw new BadRequestException('La categoría es obligatoria.');
    }

    const maxSize = UploadFileDto.category.startsWith('video')
      ? 15 * 1024 * 1024
      : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException(
        `El tamaño del archivo excede el límite permitido de ${maxSize} MB.`,
      );
    }

    try {
      console.log('Archivo de imagen recibido:', file);
      const result = await this.fileUploadService.uploadImage(
        file,
        UploadFileDto.category,
        UploadFileDto.userId,
      );
      return this.buildResponse('Imagen subida exitosamente', result);
    } catch (error) {
      this.handleError(error, 'subir la imagen');
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener la URL de un archivo subido' })
  @ApiResponse({
    status: 200,
    description: 'URL del archivo encontrada.',
    schema: { type: 'object', properties: { url: { type: 'string' } } },
  })
  @ApiResponse({ status: 400, description: 'URL no encontrada.' })
  async getImageUrl(@Param('id') id: string): Promise<{ url: string }> {
    try {
      const result = await this.fileUploadService.getFileUploadUrl(id);
      return result;
    } catch (error) {
      throw new BadRequestException(error, 'obtener la URL de la imagen');
    }
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  @ApiOperation({ summary: 'Subir una foto de perfil' })
  @ApiBody({ type: UploadProfilePictureDto })
  @ApiResponse({
    status: 200,
    description: 'Foto de perfil subida exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al subir la foto de perfil.',
  })
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadProfilePictureDto: UploadProfilePictureDto,
  ) {
    this.validateFile(file);
    try {
      console.log('Archivo de perfil recibido:', file);
      const result = await this.fileUploadService.uploadProfilePicture(
        file,
        uploadProfilePictureDto.userId,
      );
      return this.buildResponse('Foto de perfil subida exitosamente', result);
    } catch (error) {
      this.handleError(error, 'subir la foto de perfil');
    }
  }
}
