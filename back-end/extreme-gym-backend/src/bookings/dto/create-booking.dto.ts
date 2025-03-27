import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateBookingDto {
  @IsString()
  userId: string; // ID del usuario que hace la reserva

  @IsString()
  eventId: string; // ID del evento que se reserva

  @IsNumber()
  @IsPositive()
  numberOfPeople: number;
}
