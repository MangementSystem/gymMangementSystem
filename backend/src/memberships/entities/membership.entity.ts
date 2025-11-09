import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Member } from '../../members/entities/member.entity';
import { Plan } from '../../plans/entities/plan.entity';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Organization, org => org.memberships)
  organization: Organization;

  @ManyToOne(() => Member, m => m.memberships)
  member: Member;

  @ManyToOne(() => Plan)
  plan: Plan;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column()
  status: string;

  @Column({ type: 'numeric' })
  total_amount: number;

  @Column({ type: 'numeric' })
  paid_amount: number;

  @Column({ type: 'numeric' })
  remaining_amount: number;

  @CreateDateColumn()
  created_at: Date;
}
