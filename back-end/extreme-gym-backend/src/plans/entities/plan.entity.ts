import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserPlan } from './user-plan.entity';
import { Publication } from 'src/community/entities/publication.entity';

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

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @OneToMany(() => UserPlan, (userPlan) => userPlan.plan)
  userPlans: UserPlan[];

  @OneToMany(() => Publication, (publication) => publication.plan)
  publications: Publication[];
}
