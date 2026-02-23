import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(createExerciseDto);
    return this.exerciseRepository.save(exercise);
  }

  async findAll(category?: string, equipment?: string): Promise<Exercise[]> {
    const query = this.exerciseRepository.createQueryBuilder('exercise');

    if (category) {
      query.andWhere('exercise.category = :category', { category });
    }

    if (equipment) {
      query.andWhere('exercise.equipment = :equipment', { equipment });
    }

    return query.orderBy('exercise.name', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
    });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async update(
    id: number,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const exercise = await this.findOne(id);
    Object.assign(exercise, updateExerciseDto);
    return this.exerciseRepository.save(exercise);
  }

  async remove(id: number): Promise<void> {
    const exercise = await this.findOne(id);
    await this.exerciseRepository.remove(exercise);
  }
}
