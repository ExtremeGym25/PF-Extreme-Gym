import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrainingRouteService } from './training-route.service';
import { CreateTrainingRouteDto } from './dto/create-training-route.dto';
import { UpdateTrainingRouteDto } from './dto/update-training-route.dto';

@Controller('training-route')
export class TrainingRouteController {
  constructor(private readonly trainingRouteService: TrainingRouteService) {}

  @Post()
  create(@Body() createTrainingRouteDto: CreateTrainingRouteDto) {
    return this.trainingRouteService.create(createTrainingRouteDto);
  }

  @Get()
  findAll() {
    return this.trainingRouteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingRouteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingRouteDto: UpdateTrainingRouteDto) {
    return this.trainingRouteService.update(+id, updateTrainingRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingRouteService.remove(+id);
  }
}
