import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { format } from 'date-fns';
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
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationsService } from '../notifications/notifications.service';

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
    private readonly mailService: MailerService,
    private readonly notificationsService: NotificationsService,
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
    const exists = await this.userPlanRepo.findOne({
      where: { userId, planId: dto.planId },
    });

    if (exists) {
      throw new ForbiddenException('Ya estás inscrito en este plan');
    }

    await this.userPlanRepo.save({ userId, planId: dto.planId });
    // Obtener el plan asociado para enviar información
    const plan = await this.planRepo.findOne({ where: { id: dto.planId } });

    if (plan) {
      // Enviar correo de confirmación
      await this.notificationsService.sendPlanAssignmentEmail(
        user.email,
        user.name,
        plan.nombre,
      );
    }

    if (plan) {
      // Aquí suponemos que el plan tiene un campo `imageUrl` o `videoUrl`
      const mediaUrl = plan.imageUrl;
    }
    return { message: 'Plan asignado correctamente' };
  }

  async checkExpirations() {
    const todayString = new Date().toISOString();

    // Buscar usuarios con suscripción expirada
    const users = await this.userRepo.find({
      where: {
        subscriptionExpirationDate: LessThan(todayString),
        isActive: true,
      },
      relations: ['plans'],
    });

    if (users.length === 0) {
      return {
        message: 'No hay usuarios con suscripción expirada hoy.',
        expiredUsers: [],
      };
    }

    // Procesar cada usuario
    for (const user of users) {
      try {
        // 1. Guardar notificación en DB
        await this.notificationRepo.save({
          mensaje: 'Tu suscripción ha expirado. Renueva ahora.',
          user,
        });

        // 2. Enviar correo
        await this.mailService.sendMail({
          to: user.email,
          subject: 'Tu suscripción ha expirado',
          template: './plan-expiracion', // Si usas plantillas
          context: {
            name: user.name,
            expirationDate: format(
              new Date(user.subscriptionExpirationDate),
              'dd/MM/yyyy',
            ), // Usa date-fns o similar
            currentYear: new Date().getFullYear().toString(),
          },
        });

        console.log(`📧 Correo enviado a ${user.email}`);
      } catch (error) {
        console.error(`❌ Error al notificar a ${user.email}:`, error.message);
      }
    }

    return {
      message: `Notificaciones enviadas a ${users.length} usuarios.`,
      expiredUsers: users.map((user) => ({
        id: user.id,
        email: user.email,
      })),
    };
  }

  async getUserPlans(userId: string) {
    const plans = await this.userPlanRepo.find({
      where: { userId },
      relations: ['plan'],
    });

    if (!plans) {
      throw new NotFoundException(`Error al cargar los planes`);
    }
    const plansWithMedia = await Promise.all(
      plans.map(async (userPlan) => {
        const plan = await this.planRepo.findOne({
          where: { id: userPlan.planId },
        });

        return {
          ...userPlan,
          plan: plan,
        };
      }),
    );

    return plansWithMedia;
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
    await this.userPlanRepo.delete({ planId: id });
    await this.planRepo.delete(id);
  }

  async updatePlan(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.planRepo.findOneBy({ id });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    return this.planRepo.save({ ...plan, ...dto });
  }
  async updatePlanImage(planId: string, imageUrl: string): Promise<Plan> {
    const plan = await this.planRepo.findOneBy({ id: planId });
    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }

    plan.imageUrl = imageUrl;
    return this.planRepo.save(plan);
  }
}
