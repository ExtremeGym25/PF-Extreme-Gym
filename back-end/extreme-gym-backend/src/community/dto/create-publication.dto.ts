import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  planId?: string;

  @IsOptional()
  @IsUUID()
  eventId?: string;
}
