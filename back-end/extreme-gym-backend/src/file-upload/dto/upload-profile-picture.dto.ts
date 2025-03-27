import { IsNotEmpty, IsString } from 'class-validator';

export class UploadProfilePictureDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
