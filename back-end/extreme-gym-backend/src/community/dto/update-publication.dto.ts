import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdatePublicationDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  planId?: string;

  @IsOptional()
  @IsUUID()
  eventId?: string;
}
