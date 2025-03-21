import { IsDateString } from 'class-validator';
import { Subscription } from 'src/payments/entities/payment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({
  name: 'USER',
})
export class User {
  [x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  password: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar',
      nullable: true,
      default: "" })
  profileImage?: string;
  
  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'planId' })
  plan: Subscription; 

  @Column({ nullable: true })
  @IsDateString()
  subscriptionExpirationDate: string; 

  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
  user: any;
}
