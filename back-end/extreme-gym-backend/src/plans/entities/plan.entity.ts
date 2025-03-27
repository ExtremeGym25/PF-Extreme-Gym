import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserPlan } from './user-plan.entity';

export enum PlanCategory {
  SALUD = 'salud',
  FUERZA = 'fuerza',
  ESPECIALIZADO = 'especializado',
  FUNCIONAL = 'funcional',
  ACUATICO = 'acuatico',
  MENTECUERPO = 'mentecuerpo',
  ARTESMARCIALES = 'artesmarciales',
  AEROBICO = 'aerobico',
}

@Entity({ name: 'PLAN' })
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: PlanCategory,
    default: PlanCategory.SALUD,
  })
  categoria: PlanCategory;

  @OneToMany(() => UserPlan, (userPlan) => userPlan.plan)
  userPlans: UserPlan[];
}
