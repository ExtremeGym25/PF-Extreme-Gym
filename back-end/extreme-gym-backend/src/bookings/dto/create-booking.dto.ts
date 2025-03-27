import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateBookingDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;

  @IsNumber()
  @IsPositive()
  numberOfPeople: number;
}
