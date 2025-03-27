import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean, IsNumber, IsPositive, IsEnum, IsUUID } from 'class-validator';


export enum ExtremeSportCategory {
  ALPINE_SKIING = 'Esquí Alpino',
  ROCK_CLIMBING = 'Escalada en roca',
  WHITEWATER_RAFTING = 'Rafting en aguas bravas',
  PARAGLIDING = 'Parapente',
  SKYDIVING = 'Paracaidismo',
  BUNGEE_JUMPING = 'Puenting',
  MOTOCROSS = 'Motocross',
  BASE_JUMPING = 'BASE jumping',
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

  @IsEnum(ExtremeSportCategory)
  category: ExtremeSportCategory;

  @IsUUID() // Validación para garantizar que es un UUID
  userId: string; // Campo para asociar con el usuario que crea el evento
}
