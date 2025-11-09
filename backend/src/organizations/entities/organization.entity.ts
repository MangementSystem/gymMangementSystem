import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { Membership } from '../../memberships/entities/membership.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { AttendanceDevice } from '../../attendance-devices/entities/attendance-device.entity';
import { AttendanceLog } from '../../attendance-logs/entities/attendance-log.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  owner_id: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Member, member => member.organization)
  members: Member[];

  @OneToMany(() => Plan, plan => plan.organization)
  plans: Plan[];

  @OneToMany(() => Membership, m => m.organization)
  memberships: Membership[];

  @OneToMany(() => Transaction, t => t.organization)
  transactions: Transaction[];

  @OneToMany(() => AttendanceDevice, d => d.organization)
  devices: AttendanceDevice[];

  @OneToMany(() => AttendanceLog, l => l.organization)
  logs: AttendanceLog[];
}
