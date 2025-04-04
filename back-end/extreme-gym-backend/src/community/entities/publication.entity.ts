import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { Event } from '../../event/entities/event.entity';
import { Comment } from './comment.entity';

@Entity()
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => User, (user) => user.publications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Plan, (plan) => plan.publications, { nullable: true })
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @Column({ nullable: true })
  planId?: string;

  @ManyToOne(() => Event, (event) => event.publications, { nullable: true })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ nullable: true })
  eventId?: string;

  @OneToMany(() => Comment, (comment) => comment.publication)
  comments: Comment[];
}
