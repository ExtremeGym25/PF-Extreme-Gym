import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { ExtremeSportCategory } from './create-event.dto';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  time?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(ExtremeSportCategory)
  @IsOptional()
  category?: ExtremeSportCategory;

  @IsBoolean()
  @IsOptional()
  isCancelled?: boolean;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
