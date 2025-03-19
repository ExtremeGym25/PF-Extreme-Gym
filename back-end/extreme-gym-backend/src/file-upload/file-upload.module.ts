import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({
    fileFilter: (req, file, cb) => {
      if(file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else { 
        cb (new Error ('Tipo de archivo no permitido'), false);
      }
    },
  }),
],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
