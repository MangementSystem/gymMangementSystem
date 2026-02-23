import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Member } from '../../members/entities/member.entity';
import { AttendanceDevice } from '../../attendance-devices/entities/attendance-device.entity';

@Entity('attendance_logs')
export class AttendanceLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Organization, (org) => org.logs)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Member, (m) => m.attendance_logs)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => AttendanceDevice, (d) => d.logs)
  @JoinColumn({ name: 'device_id' })
  device: AttendanceDevice;

  @Column({ type: 'timestamp', nullable: true })
  check_in: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_out: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;
}
