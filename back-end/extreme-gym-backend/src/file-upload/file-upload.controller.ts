import { BadRequestException, Controller, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if(!file) {
      throw new BadRequestException('No se ha recibido ningún archivo.'); 
    }
    try {
      console.log('Archivo recibido:', file);
      const result = await this.fileUploadService.uploadFile(file);
      return {
        message: 'Archivo subido exitosamente',
        url: result.secure_url,
      };
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      throw new InternalServerErrorException(
        'Error al subir el archivo. Intenta nuevamente más tarde.'
      );  
    }
  }
}
