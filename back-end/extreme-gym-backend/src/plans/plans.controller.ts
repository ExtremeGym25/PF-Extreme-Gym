import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { PlanService } from './plans.service';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { User as UserDecorator } from '../decorators/user.decorator'; 
import { User } from '../users/entities/user.entity'; 
import { PlanCategory } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('assign')
  async assignPlan(@UserDecorator() user: User, @Body() dto: AssignPlanDto) {
    return this.planService.assignPlan(user.id, dto);
  }

  @Post('create')
  async createPlan(@Body() dto: CreatePlanDto) {
    return this.planService.createPlan(dto);
  }

  @Get()
  async getPlans(
    @Query('categoria') categoria?: PlanCategory,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.planService.findAll({ categoria, page, limit });
  }

  @Get(':id')
  async getMyPlans(@UserDecorator() user: User) {
    return this.planService.getUserPlans(user.id);
  }

  @Delete(':id')
  async deletePlan(@Param('id') id: string) {
    return this.planService.deletePlan(id);
  }
  @Put(':id')
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.updatePlan(id, dto);
  }
}
