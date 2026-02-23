import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Plan } from '../plans/entities/plan.entity';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const membership = this.membershipRepository.create({
      ...createMembershipDto,
      organization: { id: createMembershipDto.organizationId },
      member: { id: createMembershipDto.memberId },
      plan: { id: createMembershipDto.planId },
    });
    return this.membershipRepository.save(membership);
  }

  async findAll(
    organizationId?: number,
    memberId?: number,
    status?: string,
  ): Promise<Membership[]> {
    const query = this.membershipRepository
      .createQueryBuilder('membership')
      .leftJoinAndSelect('membership.member', 'member')
      .leftJoinAndSelect('membership.plan', 'plan')
      .leftJoinAndSelect('membership.organization', 'organization');

    if (organizationId) {
      query.andWhere('membership.organization = :organizationId', {
        organizationId,
      });
    }

    if (memberId) {
      query.andWhere('membership.member = :memberId', { memberId });
    }

    if (status) {
      query.andWhere('membership.status = :status', { status });
    }

    return query.orderBy('membership.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Membership> {
    const membership = await this.membershipRepository.findOne({
      where: { id },
      relations: ['member', 'plan', 'organization'],
    });
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    return membership;
  }

  async update(
    id: number,
    updateMembershipDto: UpdateMembershipDto,
  ): Promise<Membership> {
    const membership = await this.findOne(id);
    Object.assign(membership, updateMembershipDto);
    return this.membershipRepository.save(membership);
  }

  async remove(id: number): Promise<void> {
    const membership = await this.findOne(id);
    await this.membershipRepository.remove(membership);
  }

  async renew(id: number, planId: number): Promise<Membership> {
    const membership = await this.findOne(id);
    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }
    membership.plan = plan;
    membership.status = 'renewed';
    return this.membershipRepository.save(membership);
  }

  async cancel(id: number): Promise<Membership> {
    const membership = await this.findOne(id);
    membership.status = 'cancelled';
    return this.membershipRepository.save(membership);
  }
}
