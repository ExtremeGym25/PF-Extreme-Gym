import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'TRAINING_ROUTE' })
export class TrainingRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column('text')
  description: string;

}
