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

  private validateFileType(
    file: Express.Multer.File,
    allowedTypes: string[],
    errorMessage: string,
  ): void {
    const { mimetype } = file;
    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestException(errorMessage);
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    category: string,
    userId?: string,
  ): Promise<string> {
    if (!file || file.size === 0) {
      throw new BadRequestException('El archivo no debe estar vacío');
    }
    const allowedTypes = [...this.allowedImageTypes, ...this.allowedVideoTypes];
    const errorMessage =
      'Formato de archivo no permitido. Por favor, sube un archivo de tipo imagen (PNG, JPEG, GIF) o video (MP4, WEBM, AVI).';
    this.validateFileType(file, allowedTypes, errorMessage);

    const resourceType = this.allowedVideoTypes.includes(file.mimetype)
      ? 'video'
      : 'image';
    return await this.uploadToResource(
      file,
      `${category}`,
      resourceType,
      userId,
    );
  }

  async getFileUploadUrl(id: string): Promise<{ url: string }> {
    const fileUpload = await this.fileUploadRepository.findOneBy({ id });

    if (!fileUpload) {
      throw new BadRequestException('URL no encontrada.');
    }

    return { url: fileUpload.url };
  }

  private async uploadToResource(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'video',
    userId?: string,
    context?: string,
  ): Promise<string> {
    const result = await this.uploadFileCloudinary(file, folder, resourceType);
    return await this.saveFileUpload(
      result,
      resourceType,
      userId || null,
      context || null,
    );
  }

  async uploadProfilePicture(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    this.validateFileType(
      file,
      this.allowedImageTypes,
      'Formato de archivo no permitido. Por favor, sube un archivo de tipo imagen (PNG, JPEG, GIF).',
    );
    return this.uploadToResource(
      file,
      'profile_pictures',
      'image',
      userId,
      'profile',
    );
  }

  private async saveFileUpload(
    result: UploadApiResponse,
    type: 'image' | 'video',
    userId: string | null,
    context: string | null,
  ): Promise<string> {
    let user: User | null = null;
    if (userId) {
      user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
    }

    const fileUploadData: Partial<FileUpload> = {
      url: result.secure_url,
      type: type,
      user: user,
      context: context,
    };

    const fileUpload = this.fileUploadRepository.create(fileUploadData);
    await this.fileUploadRepository.save(fileUpload);

    if (type === 'image' && user && context === 'profile') {
      user.profileImage = result.secure_url;
      await this.userRepository.save(user);
    }
    return result.secure_url;
  }

  private uploadFileCloudinary(
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
              new BadRequestException(
                `Error al subir el ${resourceType}: ${error.message}`,
              ),
            );
          }
          if (!result) {
            return reject(
              new BadRequestException(
                'No se recibió un resultado válido de Cloudinary.',
              ),
            );
          }
          resolve(result);
        },
      );

      if (!file.buffer) {
        return reject(
          new BadRequestException(
            'El archivo no debe estar vacío; no se recibió un buffer.',
          ),
        );
      }

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
