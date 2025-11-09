import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Membership } from '../../memberships/entities/membership.entity';
import { Member } from '../../members/entities/member.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Organization, org => org.transactions)
  organization: Organization;

  @ManyToOne(() => Membership)
  membership: Membership;

  @ManyToOne(() => Member)
  member: Member;

  @Column()
  type: string;

  @Column()
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  payment_method: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
