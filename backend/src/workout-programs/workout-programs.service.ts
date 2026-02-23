import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutProgram } from './entities/workout-program.entity';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';

@Injectable()
export class WorkoutProgramsService {
  constructor(
    @InjectRepository(WorkoutProgram)
    private workoutProgramRepository: Repository<WorkoutProgram>,
  ) {}

  async create(
    createWorkoutProgramDto: CreateWorkoutProgramDto,
  ): Promise<WorkoutProgram> {
    const workoutProgram = this.workoutProgramRepository.create({
      ...createWorkoutProgramDto,
      member: { id: createWorkoutProgramDto.memberId },
    });
    return this.workoutProgramRepository.save(workoutProgram);
  }

  async findAll(memberId?: number): Promise<WorkoutProgram[]> {
    const query = this.workoutProgramRepository
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.member', 'member')
      .leftJoinAndSelect('program.exercises', 'exercises')
      .leftJoinAndSelect('exercises.exercise', 'exercise');

    if (memberId) {
      query.andWhere('program.member = :memberId', { memberId });
    }

    return query.orderBy('program.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<WorkoutProgram> {
    const workoutProgram = await this.workoutProgramRepository.findOne({
      where: { id },
      relations: ['member', 'exercises', 'exercises.exercise', 'logs'],
    });
    if (!workoutProgram) {
      throw new NotFoundException(`Workout program with ID ${id} not found`);
    }
    return workoutProgram;
  }

  async update(
    id: number,
    updateWorkoutProgramDto: UpdateWorkoutProgramDto,
  ): Promise<WorkoutProgram> {
    const workoutProgram = await this.findOne(id);
    Object.assign(workoutProgram, updateWorkoutProgramDto);
    return this.workoutProgramRepository.save(workoutProgram);
  }

  async remove(id: number): Promise<void> {
    const workoutProgram = await this.findOne(id);
    await this.workoutProgramRepository.remove(workoutProgram);
  }
}
