import { IsDateString } from 'class-validator';
import { Booking } from 'src/bookings/entities/booking.entity';
import { FileUpload } from 'src/file-upload/entities/file-upload.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { UserPlan } from 'src/plans/entities/user-plan.entity';
import { Account } from '../../auth/entities/account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Publication } from 'src/community/entities/publication.entity';
import { Comment } from 'src/community/entities/comment.entity';
import { Subscription } from 'rxjs/internal/Subscription';

@Entity({
  name: 'USER',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  password: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default:
      'https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_1_ivgi8t.png',
  })
  profileImage?: string;

  @Column({ type: 'varchar', nullable: true })
  provider?: string; // 'local', 'google', 'facebook'

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'planid' })
  plan: Subscription;
  @Column({
    type: 'enum',
    enum: ['free', 'premium'],
    default: 'free',
  })
  subscriptionType: 'free' | 'premium';

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

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

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => FileUpload, (fileUpload) => fileUpload.user, {
    nullable: true,
  })
  fileUploads: FileUpload[];

  @OneToMany(() => UserPlan, (userPlan) => userPlan.user)
  plans: UserPlan[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Publication, (publication) => publication.user)
  publications: Publication[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
