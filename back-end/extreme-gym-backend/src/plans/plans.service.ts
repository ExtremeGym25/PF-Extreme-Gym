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
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanCategory } from './entities/plan.entity';
import { UpdatePlanDto } from './dto/update-plan.dto';

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

  async getUserPlans(userId: string) {
    return this.userPlanRepo.find({
      where: { userId },
      relations: ['plan'],
    });
  }

  async findAll(
    options: { categoria?: PlanCategory; page?: number; limit?: number } = {},
  ): Promise<{ data: Plan[]; total: number }> {
    const { categoria, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = this.planRepo.createQueryBuilder('plan');

    if (categoria) {
      query.where('plan.categoria = :categoria', { categoria });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return { data, total };
  }

  async createPlan(dto: CreatePlanDto): Promise<Plan> {
    return this.planRepo.save(dto);
  }

  async deletePlan(id: string): Promise<void> {
    await this.userPlanRepo.delete({ planId: id }); // Primero elimina relaciones
    await this.planRepo.delete(id);
  }

  async updatePlan(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.planRepo.findOneBy({ id });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    return this.planRepo.save({ ...plan, ...dto });
  }
}
