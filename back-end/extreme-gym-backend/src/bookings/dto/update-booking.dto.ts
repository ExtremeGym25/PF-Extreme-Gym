import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  eventId?: string;

  @IsOptional()
  @IsNumber()
  numberOfPeople?: number;
}
