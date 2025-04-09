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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Plans')
@Controller('plans')
@UseGuards(AuthGuard)
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('assign')
  @ApiOperation({ summary: 'Asignar un plan a un usuario' })
  @ApiBody({ type: AssignPlanDto })
  @ApiResponse({ status: 200, description: 'Plan asignado exitosamente.' })
  async assignPlan(@UserDecorator() user: User, @Body() dto: AssignPlanDto) {
    return this.planService.assignPlan(user.id, dto);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear un nuevo plan' })
  @ApiBody({ type: CreatePlanDto })
  @ApiResponse({ status: 201, description: 'Plan creado exitosamente.' })
  async createPlan(@Body() dto: CreatePlanDto) {
    return this.planService.createPlan(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes retornada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'No se encontraron planes.' })
  async getPlans(
    @Query('categoria') categoria?: PlanCategory,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.planService.findAll({ categoria, page, limit });
  }

  @Get('my-plans')
  @ApiOperation({ summary: 'Obtener planes asignados al usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes asignados retornada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'No tienes planes asignados.' })
  async getMyPlans(@UserDecorator() user: User) {
    const plans = await this.planService.getUserPlans(user.id);

    if (!plans || plans.length === 0) {
      throw new NotFoundException('No tienes planes asignados');
    }

    return plans;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Eliminar un plan por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del plan a eliminar',
  })
  @ApiResponse({ status: 200, description: 'Plan eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Plan no encontrado.' })
  async deletePlan(@Param('id') id: string) {
    await this.planService.deletePlan(id);
    return {
      statusCode: 200,
      message: 'Plan eliminado correctamente',
    };
  }
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar un plan por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del plan a actualizar',
  })
  @ApiBody({ type: UpdatePlanDto })
  @ApiResponse({ status: 200, description: 'Plan actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Plan no encontrado.' })
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.updatePlan(id, dto);
  }
  @Get('check-expirations')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Verificar expiraciones de planes' })
  @ApiResponse({
    status: 200,
    description:
      'Estado de las verificaciones de expiraciones retornado exitosamente.',
  })
  async checkExpirations() {
    const result = await this.planService.checkExpirations();
    return {
      status: 'success',
      data: result,
    };
  }
  @Post('upload-image/:planId')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir una imagen para un plan' })
  @ApiParam({
    name: 'planId',
    required: true,
    description: 'ID del plan para el cual se subirá la imagen',
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen subida exitosamente.',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Error al subir la imagen del plan.',
  })
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
