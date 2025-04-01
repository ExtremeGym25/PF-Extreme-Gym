import { Booking } from "src/bookings/entities/booking.entity";
import { Publication } from "src/community/entities/publication.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'EVENTS',
})
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar', length: 100 })
  location: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  category: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;

  @Column({ default: false })
  isCancelled: boolean;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.fileUploads)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @OneToMany(() => Publication, (publication) => publication.event)
  publications: Publication[];

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
