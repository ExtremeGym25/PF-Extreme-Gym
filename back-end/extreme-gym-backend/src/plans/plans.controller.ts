import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { PlanService } from './plans.service';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { User as UserDecorator } from '../decorators/user.decorator'; 
import { User } from '../users/entities/user.entity'; 

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('assign')
  async assignPlan(@UserDecorator() user: User, @Body() dto: AssignPlanDto) {
    return this.planService.assignPlan(user.id, dto);
  }

  async getMyPlans(@UserDecorator() user: User) {
    return this.planService.getUserPlans(user.id); 
  }
}
