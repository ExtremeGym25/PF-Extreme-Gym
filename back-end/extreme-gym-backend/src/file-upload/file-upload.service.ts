import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
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

  private validateImageType(file: Express.Multer.File): void {
    const { mimetype } = file;

    if (!this.allowedImageTypes.includes(mimetype)) {
      throw new BadRequestException(
        'Formato de archivo no permitido. Por favor, sube un archivo de tipo imagen (PNG, JPEG, GIF).',
      );
    }
  }

  // Este método valida los tipos de video permitidos.
  private validateVideoType(file: Express.Multer.File): void {
    const { mimetype } = file;

    if (!this.allowedVideoTypes.includes(mimetype)) {
      throw new BadRequestException(
        'Formato de archivo no permitido. Por favor, sube un archivo de tipo video (MP4, WEBM, AVI).',
      );
    }
  }
  // Método para cargar imágenes generales.
  // Método para cargar imágenes generales.
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    this.validateImageType(file); // Validación para imágenes generales
    return this.uploadFile(file, 'images');
  }

  // Método para cargar imágenes de perfil.
  async uploadProfilePicture(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    this.validateImageType(file); // Validación para imágenes de perfil
    return this.uploadFile(file, 'profile_pictures');
  }

  // Método para cargar videos.
  async uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    this.validateVideoType(file); // Validación para videos
    return this.uploadFile(file, 'videos', 'video');
  }

  // Método común para subir archivos a Cloudinary.
  private uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'video' = 'image', // Por defecto es 'image'
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: `extremegym/${folder}` }, // Carpeta específica
        (error, result) => {
          if (error) {
            console.log(`Error al subir el ${resourceType}`, error);
            return reject(
              new Error(`Error al subir el ${resourceType}: ${error.message}`),
            );
          }
          if (!result) {
            // Si result es undefined, rechaza la promesa
            return reject(
              new Error('No se recibió un resultado válido de Cloudinary.'),
            );
          }
          resolve(result); // Resolviendo la promesa solo si result es válido
        },
      );

      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream).on('error', (error) => {
        console.log(`Error en el sistema al subir el ${resourceType}`, error);
        reject(error);
      });
    });
  }
}
