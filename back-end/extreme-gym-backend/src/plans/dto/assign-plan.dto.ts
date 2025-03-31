import { IsString, IsUUID } from 'class-validator';

export class AssignPlanDto {
  @IsUUID()
  planId: string;

}
