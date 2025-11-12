import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WorkoutLogSet } from '../../workout-log-sets/entities/workout-log-set.entity';
import { WorkoutProgramExercise } from '../../workout-program-exercises/entities/workout-program-exercise.entity';
import { AiExerciseAnalysis } from '../../ai-exercise-analysis/entities/ai-exercise-analysis.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  equipment: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => WorkoutLogSet, set => set.exercise)
  log_sets: WorkoutLogSet[];

  @OneToMany(() => WorkoutProgramExercise, programExercise => programExercise.exercise)
  program_exercises: WorkoutProgramExercise[];

  @OneToMany(() => AiExerciseAnalysis, analysis => analysis.exercise)
  ai_analysis: AiExerciseAnalysis[];
}
