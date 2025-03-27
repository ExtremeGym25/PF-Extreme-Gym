import { Event } from "src/event/entities/event.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'BOOKINGS',
})
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  event: Event;

  @Column()
  numberOfPeople: number;

  @Column({ type: Date })
  bookingsDate: Date;

  @Column({ default: false })
  isCancelled: boolean;
}
