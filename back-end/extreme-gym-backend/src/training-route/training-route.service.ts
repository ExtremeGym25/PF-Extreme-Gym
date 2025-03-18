import { Injectable } from '@nestjs/common';
import { CreateTrainingRouteDto } from './dto/create-training-route.dto';
import { UpdateTrainingRouteDto } from './dto/update-training-route.dto';

@Injectable()
export class TrainingRouteService {
  create(createTrainingRouteDto: CreateTrainingRouteDto) {
    return 'This action adds a new trainingRoute';
  }

  findAll() {
    return `This action returns all trainingRoute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainingRoute`;
  }

  update(id: number, updateTrainingRouteDto: UpdateTrainingRouteDto) {
    return `This action updates a #${id} trainingRoute`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainingRoute`;
  }
}
