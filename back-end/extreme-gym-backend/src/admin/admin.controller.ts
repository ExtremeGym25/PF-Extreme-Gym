import { Controller, Get } from '@nestjs/common';
import { adminService } from './admin.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('dashboard')
export class adminController {
  constructor(private readonly dashboardService: adminService) {}

  @Get('admin')
  @ApiOperation({
    summary: 'Obtener estadísticas del dashboard de administración',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del dashboard recuperadas exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al recuperar estadísticas del dashboard.',
  })
  getDashboardStats() {
    return this.dashboardService.getStats();
  }
}
