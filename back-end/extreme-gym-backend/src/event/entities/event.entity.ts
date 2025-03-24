import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'EVENT'
})
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column()
  capacity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;

  @Column({ default: false })
  isCancelled: boolean;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
