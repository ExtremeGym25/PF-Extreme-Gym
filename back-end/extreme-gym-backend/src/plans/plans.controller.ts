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
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('assign')
  @UseGuards(AuthGuard)
  async assignPlan(@UserDecorator() user: User, @Body() dto: AssignPlanDto) {
    if (!user || !user.id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.planService.assignPlan(user.id, dto);
  }

  @Post('create')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async createPlan(@Body() dto: CreatePlanDto) {
    return this.planService.createPlan(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getPlans(
    @Query('categoria') categoria?: PlanCategory,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.planService.findAll({ categoria, page, limit });
  }

  @Get('my-plans')
  @UseGuards(AuthGuard)
  async getMyPlans(@UserDecorator() user: User) {
    const plans = await this.planService.getUserPlans(user.id);

    if (!plans || plans.length === 0) {
      throw new NotFoundException('No tienes planes asignados');
    }

    return plans;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async deletePlan(@Param('id') id: string) {
    await this.planService.deletePlan(id);
    return {
      statusCode: 200,
      message: 'Plan eliminado correctamente',
    };
  }
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.updatePlan(id, dto);
  }
  @Get('check-expirations')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async checkExpirations() {
    const result = await this.planService.checkExpirations();
    return {
      status: 'success',
      data: result,
    };
  }
  @Post('upload-image/:planId')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
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
      // Aquí puedes actualizar tu entidad Plan con la imageUrl usando plansService
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
