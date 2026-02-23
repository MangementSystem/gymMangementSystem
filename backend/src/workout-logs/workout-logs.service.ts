import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutLog } from './entities/workout-log.entity';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';

@Injectable()
export class WorkoutLogsService {
  constructor(
    @InjectRepository(WorkoutLog)
    private workoutLogRepository: Repository<WorkoutLog>,
  ) {}

  async create(createWorkoutLogDto: CreateWorkoutLogDto): Promise<WorkoutLog> {
    const workoutLog = this.workoutLogRepository.create({
      ...createWorkoutLogDto,
      member: { id: createWorkoutLogDto.memberId },
      program: createWorkoutLogDto.programId
        ? { id: createWorkoutLogDto.programId }
        : undefined,
    });
    return this.workoutLogRepository.save(workoutLog);
  }

  async findAll(
    memberId?: number,
    programId?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<WorkoutLog[]> {
    const query = this.workoutLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.member', 'member')
      .leftJoinAndSelect('log.program', 'program')
      .leftJoinAndSelect('log.sets', 'sets')
      .leftJoinAndSelect('sets.exercise', 'exercise');

    if (memberId) {
      query.andWhere('log.member = :memberId', { memberId });
    }

    if (programId) {
      query.andWhere('log.program = :programId', { programId });
    }

    if (startDate) {
      query.andWhere('log.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('log.date <= :endDate', { endDate });
    }

    return query.orderBy('log.date', 'DESC').getMany();
  }

  async findOne(id: number): Promise<WorkoutLog> {
    const workoutLog = await this.workoutLogRepository.findOne({
      where: { id },
      relations: ['member', 'program', 'sets', 'sets.exercise', 'ai_analysis'],
    });
    if (!workoutLog) {
      throw new NotFoundException(`Workout log with ID ${id} not found`);
    }
    return workoutLog;
  }

  async update(
    id: number,
    updateWorkoutLogDto: UpdateWorkoutLogDto,
  ): Promise<WorkoutLog> {
    const workoutLog = await this.findOne(id);
    Object.assign(workoutLog, updateWorkoutLogDto);
    return this.workoutLogRepository.save(workoutLog);
  }

  async remove(id: number): Promise<void> {
    const workoutLog = await this.findOne(id);
    await this.workoutLogRepository.remove(workoutLog);
  }
}
