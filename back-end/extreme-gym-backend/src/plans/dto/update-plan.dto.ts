import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { PlanCategory } from '../entities/plan.entity';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(PlanCategory)
  @IsOptional()
  categoria?: PlanCategory;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
