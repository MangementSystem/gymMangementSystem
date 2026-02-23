import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  async create(createProgressDto: CreateProgressDto): Promise<Progress> {
    const progress = this.progressRepository.create({
      ...createProgressDto,
      member: { id: createProgressDto.memberId },
    });
    return this.progressRepository.save(progress);
  }

  async findAll(
    memberId?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<Progress[]> {
    const query = this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.member', 'member');

    if (memberId) {
      query.andWhere('progress.member = :memberId', { memberId });
    }

    if (startDate) {
      query.andWhere('progress.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('progress.date <= :endDate', { endDate });
    }

    return query.orderBy('progress.date', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Progress> {
    const progress = await this.progressRepository.findOne({
      where: { id },
      relations: ['member'],
    });
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return progress;
  }

  async update(
    id: number,
    updateProgressDto: UpdateProgressDto,
  ): Promise<Progress> {
    const progress = await this.findOne(id);
    Object.assign(progress, updateProgressDto);
    return this.progressRepository.save(progress);
  }

  async remove(id: number): Promise<void> {
    const progress = await this.findOne(id);
    await this.progressRepository.remove(progress);
  }
}
