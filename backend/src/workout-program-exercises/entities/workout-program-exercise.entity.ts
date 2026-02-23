import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkoutProgram } from '../../workout-programs/entities/workout-program.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('workout_program_exercises')
export class WorkoutProgramExercise {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => WorkoutProgram, (wp) => wp.exercises)
  @JoinColumn({ name: 'program_id' })
  program: WorkoutProgram;

  @ManyToOne(() => Exercise, (e) => e.program_exercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column({ type: 'int', nullable: true })
  sets: number;

  @Column({ type: 'int', nullable: true })
  reps: number;

  @Column({ type: 'numeric', nullable: true })
  target_weight: number;

  @Column({ nullable: true })
  day_of_week: string;
}
