import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string; // 'Free' o 'Premium'

    @Column('decimal', { nullable: true })
    pricePerMonth: number; // Precio mensual para Premium (simulado)

    @Column('decimal', { nullable: true })
    pricePerYear: number; // Precio anual para Premium (simulado)
}
