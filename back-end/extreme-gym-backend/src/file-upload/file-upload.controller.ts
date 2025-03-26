import {
  BadRequestException,
  Body,
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

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    this.validateFile(file);
    try {
      console.log('Archivo de imagen recibido:', file);
      const result = await this.fileUploadService.uploadImage(file, 'default');
      return this.buildResponse('Imagen subida exitosamente', result); // Aquí devolvemos directamente la URL
    } catch (error) {
      this.handleError(error, 'subir la imagen');
    }
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    this.validateFile(file);

    if (!userId) {
      throw new BadRequestException('Se debe proporcionar el userId');
    }
    try {
      console.log('Archivo de perfil recibido:', file);
      const result = await this.fileUploadService.uploadProfilePicture(
        file,
        userId,
      );
      return this.buildResponse('Foto de perfil subida exitosamente', result); // Solo devolvemos la URL
    } catch (error) {
      this.handleError(error, 'subir la foto de perfil');
    }
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 15 * 1024 * 1024 } }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    this.validateFile(file);
    try {
      console.log('Archivo de video recibido:', file);
      const result = await this.fileUploadService.uploadVideo(file);
      return this.buildResponse('Video subido exitosamente', result.secure_url); // Usa secure_url si aún lo necesitas
    } catch (error) {
      this.handleError(error, 'subir el video');
    }
  }
}
