import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity('ai_insights')
export class AiInsight {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Member, m => m.ai_insights)
  member: Member;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'jsonb', nullable: true })
  input_data: any;

  @Column({ type: 'text', nullable: true })
  ai_recommendation: string;

  @Column({ type: 'date', nullable: true })
  predicted_goal_date: Date;

  @Column({ type: 'text', nullable: true })
  risk_alert: string;

  @CreateDateColumn()
  created_at: Date;
}
