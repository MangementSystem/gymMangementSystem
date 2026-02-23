import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Organization, (org) => org.plans)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  name: string;

  @Column({ type: 'int' })
  duration_days: number;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;
}
