import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean, IsNumber, IsPositive, IsEnum, IsUUID } from 'class-validator';


export enum ExtremeSportCategory {
  AERIAL_SPORTS = 'Deportes Aéreos (Paracaidismo, Parapente, BASE Jumping)',
  WATER_SPORTS = 'Deportes Acuáticos (Surf, Kitesurf, Rafting en aguas bravas)',
  MOUNTAIN_SPORTS = 'Deportes de Montaña (Escalada en roca, Esquí Alpino, Snowboarding)',
  MOTOR_SPORTS = 'Deportes de Motor (Motocross, Rally, Carreras de velocidad)',
  ADVENTURE_SPORTS = 'Deportes de Aventura (Puenting, Ciclismo de montaña, Senderismo extremo)',
  WINTER_SPORTS = 'Deportes de Invierno (Esquí extremo, Snowboard extremo, Escalada en hielo)',
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

  @IsUUID()
  userId: string;
}
