import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  context?: string;
}
