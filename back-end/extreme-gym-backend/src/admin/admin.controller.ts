import { Controller, Get } from '@nestjs/common';
import { adminService } from './admin.service';

@Controller('dashboard')
export class adminController {
  constructor(private readonly dashboardService: adminService) {}

  @Get('admin')
  getDashboardStats() {
    return this.dashboardService.getStats();
  }
}
