import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService {
  private allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  private allowedVideoTypes = ['video/mp4', 'video/webm', 'video/avi'];

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  private validateFileType(file: Express.Multer.File): void {
    const { mimetype } = file;

    if (
      (mimetype.startsWith('image/') &&
        !this.allowedImageTypes.includes(mimetype)) ||
      (mimetype.startsWith('video/') &&
        !this.allowedVideoTypes.includes(mimetype))
    ) {
      throw new BadRequestException(
        'Formato de archivo no permitido. Por favor, sube un archivo de tipo imagen (PNG, JPEG, GIF) o video (MP4, WEBM, AVI).',
      );
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    this.validateFileType(file);

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'extremegym' },
        (error, result) => {
          if (error) {
            console.log('Error al subir el archivo', error);
            return reject(error);
          }
          if (result) {
            resolve(result);
          } else {
            console.log('No se recibio respuesta de Cloudinary');
            reject(new Error('No se recibio respuesta de Cloudinary'));
          }
        },
      );
      
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream).on('error', (error) => {
        console.log('Error en el sistema', error);
        reject(error);
      });
    });
  }
}