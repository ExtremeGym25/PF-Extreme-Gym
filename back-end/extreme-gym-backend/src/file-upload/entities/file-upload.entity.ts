import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'FILE-UPLOAD'
})
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  type: 'image' | 'video';

  @Column({ nullable: true })
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}

