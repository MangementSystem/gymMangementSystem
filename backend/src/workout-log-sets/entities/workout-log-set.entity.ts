import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkoutLog } from '../../workout-logs/entities/workout-log.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('workout_log_sets')
export class WorkoutLogSet {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => WorkoutLog, (wl) => wl.sets)
  @JoinColumn({ name: 'workout_log_id' })
  workout_log: WorkoutLog;

  @ManyToOne(() => Exercise, (e) => e.log_sets)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column({ type: 'int', nullable: true })
  set_number: number;

  @Column({ type: 'int', nullable: true })
  reps: number;

  @Column({ type: 'numeric', nullable: true })
  weight: number;

  @Column({ type: 'numeric', nullable: true })
  rpe: number;
}
