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
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PlanService } from './plans.service';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { User as UserDecorator } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { PlanCategory } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '../users/entities/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('plans')
@UseGuards(AuthGuard)
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('assign')
  async assignPlan(@UserDecorator() user: User, @Body() dto: AssignPlanDto) {
    return this.planService.assignPlan(user.id, dto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
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

  @Get('my-plans')
  async getMyPlans(@UserDecorator() user: User) {
    const plans = await this.planService.getUserPlans(user.id);

    if (!plans || plans.length === 0) {
      throw new NotFoundException('No tienes planes asignados');
    }

    return plans;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async deletePlan(@Param('id') id: string) {
    await this.planService.deletePlan(id);
    return {
      statusCode: 200,
      message: 'Plan eliminado correctamente',
    };
  }
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.updatePlan(id, dto);
  }
  @Get('check-expirations')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async checkExpirations() {
    const result = await this.planService.checkExpirations();
    return {
      status: 'success',
      data: result,
    };
  }
  @Post('upload-image/:planId')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPlanImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('planId') planId: string,
  ): Promise<{ imageUrl: string }> {
    try {
      if (!file) {
        throw new BadRequestException('No se ha recibido ningún archivo.');
      }
      const imageUrl = await this.fileUploadService.uploadImage(
        file,
        'plan_images',
      );

      await this.planService.updatePlanImage(planId, imageUrl);

      return { imageUrl };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al subir la imagen del plan.');
    }
  }
}
