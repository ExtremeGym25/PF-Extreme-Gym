import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column('decimal', { nullable: true })
    pricePerMonth: number;

    @Column('decimal', { nullable: true })
    pricePerYear: number;
}
