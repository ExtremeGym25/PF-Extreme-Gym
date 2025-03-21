import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha recibido ningún archivo.');
    }
    try {
      console.log('Archivo de imagen recibido:', file);
      const result = await this.fileUploadService.uploadImage(file);
      return {
        message: 'Imagen subida exitosamente',
        url: result.secure_url,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al subir la imagen:', error);
      throw new InternalServerErrorException(
        'Error al subir la imagen. Intenta nuevamente más tarde.',
      );
    }
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha recibido ningún archivo.');
    }
    try {
      console.log('Archivo de perfil recibido:', file);
      const result = await this.fileUploadService.uploadProfilePicture(file);
      return {
        message: 'Foto de perfil subida exitosamente',
        url: result.secure_url,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al subir la foto de perfil:', error);
      throw new InternalServerErrorException(
        'Error al subir la foto de perfil. Intenta nuevamente más tarde.',
      );
    }
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 15 * 1024 * 1024 } }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha recibido ningún archivo.');
    }
    try {
      console.log('Archivo de video recibido:', file);
      const result = await this.fileUploadService.uploadVideo(file);
      return {
        message: 'Video subido exitosamente',
        url: result.secure_url,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al subir el video:', error);
      throw new InternalServerErrorException(
        'Error al subir el video. Intenta nuevamente más tarde.',
      );
    }
  }
}
