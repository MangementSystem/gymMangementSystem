import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Member, member => member.progress)
  member: Member;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'numeric', nullable: true })
  weight: number;

  @Column({ type: 'numeric', nullable: true })
  body_fat: number;

  @Column({ type: 'numeric', nullable: true })
  muscle_mass: number;

  @Column({ type: 'text', nullable: true })
  ai_feedback: string;

  @CreateDateColumn()
  created_at: Date;
}
