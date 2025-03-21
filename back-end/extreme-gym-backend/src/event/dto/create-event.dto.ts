import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean, IsNumber, IsPositive } from 'class-validator';

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
}
