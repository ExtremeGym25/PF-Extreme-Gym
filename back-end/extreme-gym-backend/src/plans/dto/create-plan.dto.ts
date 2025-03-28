import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { PlanCategory } from '../entities/plan.entity';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(PlanCategory)
  categoria: PlanCategory;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
