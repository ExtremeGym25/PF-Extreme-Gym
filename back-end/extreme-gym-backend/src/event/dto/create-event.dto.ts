import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean, IsNumber, IsPositive, IsEnum, IsUUID, IsOptional } from 'class-validator';


export enum ExtremeSportCategory {
  AERIAL_SPORTS = 'Deportes Aéreos',
  WATER_SPORTS = 'Deportes Acuáticos',
  MOUNTAIN_SPORTS = 'Deportes de Montaña',
  MOTOR_SPORTS = 'Deportes de Motor',
  ADVENTURE_SPORTS = 'Deportes de Aventura',
  WINTER_SPORTS = 'Deportes de Invierno',
}

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  time: string;

  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(ExtremeSportCategory)
  category: ExtremeSportCategory;

  @IsUUID()
  userId: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
