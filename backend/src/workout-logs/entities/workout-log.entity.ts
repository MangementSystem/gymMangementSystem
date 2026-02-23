import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { WorkoutProgram } from '../../workout-programs/entities/workout-program.entity';
import { WorkoutLogSet } from '../../workout-log-sets/entities/workout-log-set.entity';
import { AiExerciseAnalysis } from '../../ai-exercise-analysis/entities/ai-exercise-analysis.entity';

@Entity('workout_logs')
export class WorkoutLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Member, (m) => m.workout_logs)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => WorkoutProgram, (p) => p.logs)
  @JoinColumn({ name: 'program_id' })
  program: WorkoutProgram;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  ai_summary: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => WorkoutLogSet, (wls) => wls.workout_log)
  sets: WorkoutLogSet[];

  @OneToMany(() => AiExerciseAnalysis, (aea) => aea.workout_log)
  ai_analysis: AiExerciseAnalysis[];
}
