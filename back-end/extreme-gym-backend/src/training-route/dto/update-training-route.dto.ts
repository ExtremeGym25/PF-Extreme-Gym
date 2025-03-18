import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingRouteDto } from './create-training-route.dto';

export class UpdateTrainingRouteDto extends PartialType(CreateTrainingRouteDto) {}
