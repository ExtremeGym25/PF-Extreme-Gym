import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard'; // Importa tu AuthGuard
import { RolesGuard } from '../auth/guards/roles.guard'; // Importa tu RolesGuard
import { Roles } from '../decorators/roles.decorators'; // Importa tu Roles decorator
import { Role } from '../users/entities/roles.enum'; // Importa tu UserRole enum
import { AdminStatsResponseDto } from './admin.dto/admin-stats.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas del panel de administración' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estadísticas obtenidas exitosamente.',
    type: AdminStatsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso prohibido.',
  })
  @Roles(Role.Admin) // Requiere el rol de administrador para acceder a esta ruta
  async getAdminStats(): Promise<AdminStatsResponseDto> {
    return this.adminService.getStats();
  }
}
