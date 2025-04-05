import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: string; // 'oauth', 'email', 'credentials'

  @Column({ type: 'varchar' })
  provider: string; // 'google', 'facebook', 'local'

  @Column({ type: 'varchar' })
  providerAccountId: string; // ID único del proveedor

  @Column({ type: 'text', nullable: true })
  access_token?: string;

  @Column({ type: 'bigint', nullable: true })
  expires_at?: number;

  @Column({ type: 'varchar', nullable: true })
  token_type?: string;

  @Column({ type: 'text', nullable: true })
  scope?: string;

  @Column({ type: 'text', nullable: true })
  id_token?: string;

  @Column({ type: 'varchar', nullable: true })
  session_state?: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
