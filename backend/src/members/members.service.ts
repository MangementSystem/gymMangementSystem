import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = this.memberRepository.create({
      ...createMemberDto,
      organization: createMemberDto.organizationId
        ? { id: createMemberDto.organizationId }
        : undefined,
    });
    return this.memberRepository.save(member);
  }

  async findAll(organizationId?: number): Promise<Member[]> {
    const query = this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.organization', 'organization')
      .leftJoinAndSelect('member.memberships', 'memberships')
      .leftJoinAndSelect('memberships.plan', 'plan');

    if (organizationId) {
      query.andWhere('member.organization = :organizationId', {
        organizationId,
      });
    }

    return query.orderBy('member.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: [
        'organization',
        'memberships',
        'memberships.plan',
        'attendance_logs',
        'progress',
        'workout_programs',
      ],
    });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);
    const { organizationId, ...rest } = updateMemberDto;
    Object.assign(member, rest);

    if (organizationId) {
      member.organization = { id: organizationId } as any;
    }

    return this.memberRepository.save(member);
  }

  async remove(id: number): Promise<void> {
    const member = await this.findOne(id);
    await this.memberRepository.remove(member);
  }

  async getMemberStats(id: number): Promise<any> {
    const member = await this.findOne(id);
    return {
      memberId: id,
      totalWorkouts: member.workout_logs?.length || 0,
      totalAttendance: member.attendance_logs?.length || 0,
      progressEntries: member.progress?.length || 0,
      activeMemberships:
        member.memberships?.filter((m) => m.status === 'active').length || 0,
    };
  }
}
