import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PlanService } from './plans.service';

@Injectable()
export class ExpirationTask {
  constructor(private readonly planService: PlanService) {}

  @Cron('0 9 * * *') // Ejecutar diario a las 9 AM
  async handleExpirations() {
    await this.planService.checkExpirations();
  }
}
