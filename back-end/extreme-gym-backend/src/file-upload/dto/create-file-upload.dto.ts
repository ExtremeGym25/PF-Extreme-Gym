import { IsString, IsEnum } from 'class-validator';

export class CreateFileUploadDto {
  @IsString()
  url: string;

  @IsEnum(['image', 'video'])
  type: 'image' | 'video';
}
