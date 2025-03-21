import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from './entities/file-upload.entity';

@Injectable()
export class FileUploadService {
  private allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  private allowedVideoTypes = ['video/mp4', 'video/webm', 'video/avi'];

  constructor(
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
  ) {
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

  private validateVideoType(file: Express.Multer.File): void {
    const { mimetype } = file;

    if (!this.allowedVideoTypes.includes(mimetype)) {
      throw new BadRequestException(
        'Formato de archivo no permitido. Por favor, sube un archivo de tipo video (MP4, WEBM, AVI).',
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    this.validateImageType(file);
    return this.uploadFile(file, 'images');
  }

  async uploadProfilePicture(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    this.validateImageType(file); 
    const result = await this.uploadFile(file, 'profile_pictures');

    const fileUpload = this.fileUploadRepository.create({
      url: result.secure_url, 
      type: 'image', 
      createdAt: new Date(),
    });
    
    await this.fileUploadRepository.save(fileUpload);

    return result;
  }

  async uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    this.validateVideoType(file); 
    return this.uploadFile(file, 'videos', 'video');
  }

  private uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'video' = 'image',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: `extremegym/${folder}` },
        (error, result) => {
          if (error) {
            console.log(`Error al subir el ${resourceType}`, error);
            return reject(
              new Error(`Error al subir el ${resourceType}: ${error.message}`),
            );
          }
          if (!result) {

            return reject(
              new Error('No se recibió un resultado válido de Cloudinary.'),
            );
          }
          resolve(result);
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
