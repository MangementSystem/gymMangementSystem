import { Injectable } from '@nestjs/common';
import { CreateWorkoutLogSetDto } from './dto/create-workout-log-set.dto';
import { UpdateWorkoutLogSetDto } from './dto/update-workout-log-set.dto';

@Injectable()
export class WorkoutLogSetsService {
  create(createWorkoutLogSetDto: CreateWorkoutLogSetDto) {
    return 'This action adds a new workoutLogSet';
  }

  findAll() {
    return `This action returns all workoutLogSets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workoutLogSet`;
  }

  update(id: number, updateWorkoutLogSetDto: UpdateWorkoutLogSetDto) {
    return `This action updates a #${id} workoutLogSet`;
  }

  remove(id: number) {
    return `This action removes a #${id} workoutLogSet`;
  }
}
