import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.fileUploads, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ type: 'varchar', nullable: true })
  context: string | null;
}

