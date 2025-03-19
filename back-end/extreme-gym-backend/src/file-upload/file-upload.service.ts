import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService {
  constructor () {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    }); 
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve , reject) => {
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
        reject (error);
      })
    });
  }
}