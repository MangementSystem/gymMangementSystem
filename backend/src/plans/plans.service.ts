import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = this.planRepository.create({
      ...createPlanDto,
      organization: { id: createPlanDto.organizationId },
    });
    return this.planRepository.save(plan);
  }

  async findAll(organizationId?: number): Promise<Plan[]> {
    const query = this.planRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.organization', 'organization');

    if (organizationId) {
      query.andWhere('plan.organization = :organizationId', { organizationId });
    }

    return query.orderBy('plan.name', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);
    Object.assign(plan, updatePlanDto);
    return this.planRepository.save(plan);
  }

  async remove(id: number): Promise<void> {
    const plan = await this.findOne(id);
    await this.planRepository.remove(plan);
  }
}
