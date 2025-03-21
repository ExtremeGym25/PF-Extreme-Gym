import { IsString, IsDate, IsBoolean, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsDate()
  date: Date;

  @IsString()
  time: string;

  @IsNumber()
  capacity: number;

  @IsBoolean()
  isCancelled?: boolean; // Este campo es opcional
}
