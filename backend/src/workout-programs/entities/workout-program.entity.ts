import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { WorkoutProgramExercise } from '../../workout-program-exercises/entities/workout-program-exercise.entity';
import { WorkoutLog } from '../../workout-logs/entities/workout-log.entity';

@Entity('workout_programs')
export class WorkoutProgram {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Member, member => member.workout_programs)
  member: Member;

  @Column()
  name: string;

  @Column({ nullable: true })
  goal: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => WorkoutProgramExercise, wpe => wpe.program)
  exercises: WorkoutProgramExercise[];

  @OneToMany(() => WorkoutLog, wl => wl.program)
  logs: WorkoutLog[];
}
