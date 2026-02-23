import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Membership } from '../../memberships/entities/membership.entity';
import { AttendanceLog } from '../../attendance-logs/entities/attendance-log.entity';
import { Progress } from '../../progress/entities/progress.entity';
import { WorkoutProgram } from '../../workout-programs/entities/workout-program.entity';
import { WorkoutLog } from '../../workout-logs/entities/workout-log.entity';
import { AiExerciseAnalysis } from '../../ai-exercise-analysis/entities/ai-exercise-analysis.entity';
import { AiInsight } from '../../ai-insights/entities/ai-insight.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Organization, (org) => org.members)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  join_date: Date;

  @Column({ nullable: true })
  goal: string;

  @Column({ type: 'numeric', nullable: true })
  weight: number;

  @Column({ type: 'numeric', nullable: true })
  height: number;

  @Column({ type: 'jsonb', nullable: true })
  ai_profile: any;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Membership, (m) => m.member)
  memberships: Membership[];

  @OneToMany(() => AttendanceLog, (log) => log.member)
  attendance_logs: AttendanceLog[];

  @OneToMany(() => Progress, (p) => p.member)
  progress: Progress[];

  @OneToMany(() => WorkoutProgram, (wp) => wp.member)
  workout_programs: WorkoutProgram[];

  @OneToMany(() => WorkoutLog, (wl) => wl.member)
  workout_logs: WorkoutLog[];

  @OneToMany(() => AiExerciseAnalysis, (a) => a.member)
  ai_analysis: AiExerciseAnalysis[];

  @OneToMany(() => AiInsight, (a) => a.member)
  ai_insights: AiInsight[];
}
