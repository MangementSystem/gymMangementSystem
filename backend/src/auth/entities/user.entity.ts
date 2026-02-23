import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'varchar',
    default: 'member',
  })
  role: string;

  @Column({
    type: 'varchar',
    default: 'active',
  })
  status: string;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ nullable: true })
  avatar: string;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
