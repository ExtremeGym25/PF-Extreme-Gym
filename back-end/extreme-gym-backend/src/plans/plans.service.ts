import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { UserPlan } from './entities/user-plan.entity';
import { User } from '../users/entities/user.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { LessThan, Raw } from 'typeorm';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepo: Repository<Plan>,
    @InjectRepository(UserPlan)
    private userPlanRepo: Repository<UserPlan>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async assignPlan(userId: string, dto: AssignPlanDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['plans'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const expirationDate = user.subscriptionExpirationDate
      ? new Date(user.subscriptionExpirationDate)
      : null;

    if (!expirationDate || expirationDate < new Date()) {
      throw new ForbiddenException('Requiere suscripción premium activa');
    }

    // Evitar duplicados
    const exists = user.plans.some((up) => up.planId === dto.planId);
    if (exists) throw new ForbiddenException('Ya estás inscrito en este plan');

    await this.userPlanRepo.save({ userId, planId: dto.planId });
    return { message: 'Plan asignado correctamente' };
  }

  async checkExpirations() {
    const todayString = new Date().toISOString();

    // 2. Buscar usuarios con suscripción expirada
    const users = await this.userRepo.find({
      where: {
        subscriptionExpirationDate: LessThan(todayString),
        isActive: true,
      },
      relations: ['plans'],
    });

    for (const user of users) {
      await this.notificationRepo.save({
        mensaje: `Tu suscripción premium ha expirado. Renueva para mantener acceso a los planes.`,
        user,
      });
    }
  }
}
