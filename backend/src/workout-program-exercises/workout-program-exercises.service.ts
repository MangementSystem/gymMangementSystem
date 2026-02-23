import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkoutProgramExerciseDto } from './dto/create-workout-program-exercise.dto';
import { UpdateWorkoutProgramExerciseDto } from './dto/update-workout-program-exercise.dto';
import { WorkoutProgramExercise } from './entities/workout-program-exercise.entity';

@Injectable()
export class WorkoutProgramExercisesService {
  constructor(
    @InjectRepository(WorkoutProgramExercise)
    private workoutProgramExerciseRepository: Repository<WorkoutProgramExercise>,
  ) {}

  async create(
    createWorkoutProgramExerciseDto: CreateWorkoutProgramExerciseDto,
  ): Promise<WorkoutProgramExercise> {
    const workoutProgramExercise = this.workoutProgramExerciseRepository.create(
      {
        ...createWorkoutProgramExerciseDto,
        program: { id: createWorkoutProgramExerciseDto.programId },
        exercise: { id: createWorkoutProgramExerciseDto.exerciseId },
      },
    );

    return this.workoutProgramExerciseRepository.save(workoutProgramExercise);
  }

  async findAll(programId?: number): Promise<WorkoutProgramExercise[]> {
    const query = this.workoutProgramExerciseRepository
      .createQueryBuilder('programExercise')
      .leftJoinAndSelect('programExercise.program', 'program')
      .leftJoinAndSelect('programExercise.exercise', 'exercise');

    if (programId) {
      query.andWhere('programExercise.program = :programId', { programId });
    }

    return query
      .orderBy('programExercise.day_of_week', 'ASC')
      .addOrderBy('programExercise.id', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<WorkoutProgramExercise> {
    const workoutProgramExercise =
      await this.workoutProgramExerciseRepository.findOne({
        where: { id },
        relations: ['program', 'exercise'],
      });

    if (!workoutProgramExercise) {
      throw new NotFoundException(
        `Workout program exercise with ID ${id} not found`,
      );
    }

    return workoutProgramExercise;
  }

  async update(
    id: number,
    updateWorkoutProgramExerciseDto: UpdateWorkoutProgramExerciseDto,
  ): Promise<WorkoutProgramExercise> {
    const workoutProgramExercise = await this.findOne(id);
    const { programId, exerciseId, ...rest } = updateWorkoutProgramExerciseDto;

    Object.assign(workoutProgramExercise, rest);

    if (programId) {
      workoutProgramExercise.program = { id: programId } as any;
    }

    if (exerciseId) {
      workoutProgramExercise.exercise = { id: exerciseId } as any;
    }

    return this.workoutProgramExerciseRepository.save(workoutProgramExercise);
  }

  async remove(id: number): Promise<void> {
    const workoutProgramExercise = await this.findOne(id);
    await this.workoutProgramExerciseRepository.remove(workoutProgramExercise);
  }
}
