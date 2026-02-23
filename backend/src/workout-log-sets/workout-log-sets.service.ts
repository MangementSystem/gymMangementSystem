import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkoutLogSetDto } from './dto/create-workout-log-set.dto';
import { UpdateWorkoutLogSetDto } from './dto/update-workout-log-set.dto';
import { WorkoutLogSet } from './entities/workout-log-set.entity';

@Injectable()
export class WorkoutLogSetsService {
  constructor(
    @InjectRepository(WorkoutLogSet)
    private workoutLogSetRepository: Repository<WorkoutLogSet>,
  ) {}

  async create(
    createWorkoutLogSetDto: CreateWorkoutLogSetDto,
  ): Promise<WorkoutLogSet> {
    const workoutLogSet = this.workoutLogSetRepository.create({
      ...createWorkoutLogSetDto,
      workout_log: { id: createWorkoutLogSetDto.workoutLogId },
      exercise: { id: createWorkoutLogSetDto.exerciseId },
    });

    return this.workoutLogSetRepository.save(workoutLogSet);
  }

  async findAll(workoutLogId?: number): Promise<WorkoutLogSet[]> {
    const query = this.workoutLogSetRepository
      .createQueryBuilder('logSet')
      .leftJoinAndSelect('logSet.workout_log', 'workoutLog')
      .leftJoinAndSelect('logSet.exercise', 'exercise');

    if (workoutLogId) {
      query.andWhere('logSet.workout_log = :workoutLogId', { workoutLogId });
    }

    return query
      .orderBy('workoutLog.id', 'DESC')
      .addOrderBy('logSet.set_number', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<WorkoutLogSet> {
    const workoutLogSet = await this.workoutLogSetRepository.findOne({
      where: { id },
      relations: ['workout_log', 'exercise'],
    });

    if (!workoutLogSet) {
      throw new NotFoundException(`Workout log set with ID ${id} not found`);
    }

    return workoutLogSet;
  }

  async update(
    id: number,
    updateWorkoutLogSetDto: UpdateWorkoutLogSetDto,
  ): Promise<WorkoutLogSet> {
    const workoutLogSet = await this.findOne(id);
    const { workoutLogId, exerciseId, ...rest } = updateWorkoutLogSetDto;

    Object.assign(workoutLogSet, rest);

    if (workoutLogId) {
      workoutLogSet.workout_log = { id: workoutLogId } as any;
    }

    if (exerciseId) {
      workoutLogSet.exercise = { id: exerciseId } as any;
    }

    return this.workoutLogSetRepository.save(workoutLogSet);
  }

  async remove(id: number): Promise<void> {
    const workoutLogSet = await this.findOne(id);
    await this.workoutLogSetRepository.remove(workoutLogSet);
  }
}
