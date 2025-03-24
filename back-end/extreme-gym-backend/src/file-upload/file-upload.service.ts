import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from './entities/file-upload.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FileUploadService {
  private allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  private allowedVideoTypes = ['video/mp4', 'video/webm', 'video/avi'];

  constructor(
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  async uploadImage(file: Express.Multer.File, category: string): Promise<UploadApiResponse> {
    this.validateImageType(file);
    const result= await this.uploadFile(file, `images/${category} `);
    return this.saveFileUpload(result, 'image', null);
  }

  async uploadProfilePicture(
    file: Express.Multer.File, userId: string
  ): Promise<UploadApiResponse> {
    this.validateImageType(file); 
    const result = await this.uploadFile(file, 'profile_pictures');
    return await this.saveFileUpload(result, 'image', userId)
  }

  async uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    this.validateVideoType(file); 
    return this.uploadFile(file, 'videos', 'video');
  }

  private async saveFileUpload(result: UploadApiResponse, type: 'image' | 'video', userId: string | null): Promise<any> {
let user: User | null = null;
    if (userId) {
      user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
    }
    const fileUploadData: Partial<FileUpload>= {
      url: result.secure_url,
      type: type,
      userId: user,
      createdAt: new Date(),
    };

    const fileUpload= this.fileUploadRepository.create(fileUploadData);

    await this.fileUploadRepository.save(fileUpload);
    return{
      id: fileUpload.id,
      url: result.secure_url,
      type: type,
      userId: userId || null,
      publicId: result.public_id
    };
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
