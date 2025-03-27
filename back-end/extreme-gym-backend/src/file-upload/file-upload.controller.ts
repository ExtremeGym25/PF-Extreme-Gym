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
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadProfilePictureDto } from './dto/upload-profile-picture.dto';

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

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() UploadFileDto: UploadFileDto,
  ) {
    this.validateFile(file);

    const maxSize = UploadFileDto.category.startsWith('video')
    ? 15 * 1024 * 1024
    : 5 * 1024 * 1024;

    if(file.size > maxSize) {
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

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
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
