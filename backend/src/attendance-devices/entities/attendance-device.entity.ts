import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { AttendanceLog } from '../../attendance-logs/entities/attendance-log.entity';

@Entity('attendance_devices')
export class AttendanceDevice {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Organization, org => org.devices)
  organization: Organization;

  @Column()
  name: string;

  @Column()
  serial_number: string;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => AttendanceLog, log => log.device)
  logs: AttendanceLog[];
}
