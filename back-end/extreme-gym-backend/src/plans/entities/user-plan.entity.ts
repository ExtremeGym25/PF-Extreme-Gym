import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Plan } from './plan.entity';

@Entity({ name: 'USER_PLAN' }) // Nombre de tabla en mayúsculas para consistencia
export class UserPlan {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'plan_id' })
  planId: string;

  @ManyToOne(() => User, (user) => user.plans)
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.userPlans)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}
