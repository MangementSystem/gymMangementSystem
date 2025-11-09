import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { WorkoutLog } from '../../workout-logs/entities/workout-log.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('ai_exercise_analysis')
export class AiExerciseAnalysis {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Member, m => m.ai_analysis)
  member: Member;

  @ManyToOne(() => WorkoutLog, wl => wl.ai_analysis)
  workout_log: WorkoutLog;

  @ManyToOne(() => Exercise, e => e.ai_analysis)
  exercise: Exercise;

  @Column({ type: 'numeric', nullable: true })
  posture_score: number;

  @Column({ type: 'numeric', nullable: true })
  stability_score: number;

  @Column({ type: 'numeric', nullable: true })
  movement_efficiency: number;

  @Column({ nullable: true })
  risk_level: string;

  @Column({ type: 'jsonb', nullable: true })
  detected_errors: any;

  @Column({ type: 'text', nullable: true })
  recommended_fix: string;

  @CreateDateColumn()
  created_at: Date;
}
