import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'FILE_UPLOAD',
})
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  type: 'image' | 'video';


  @Column({ default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }

  @ManyToOne(() => User, (user) => user.fileUploads, {nullable: true}) // Asegúrate de que esta relación sea válida
  userId: User | null;
}

