import { Entity, 
        PrimaryGeneratedColumn, 
        Column 
    } from 'typeorm';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, nullable: false })
    name: string;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @Column({ length: 100, nullable: false })
    password: string;

    @Column('bigint')
    phone: number;

    @Column({ length: 50 })
    country: string;

    @Column('text')
    address: string;

    @Column({ length: 50 })
    city: string;

    @Column({
        type: 'boolean',
        default: false,
    })
    isAdmin: boolean;

    @Column({
        type: 'boolean',
        default: false,
    })
    premium: boolean;

    @Column({
        type: 'varchar',
        nullable: true,
        default: "",
    })
    profileImage: string;
}