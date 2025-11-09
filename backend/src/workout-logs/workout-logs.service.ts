import { Injectable } from '@nestjs/common';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';

@Injectable()
export class WorkoutLogsService {
  create(createWorkoutLogDto: CreateWorkoutLogDto) {
    return 'This action adds a new workoutLog';
  }

  findAll() {
    return `This action returns all workoutLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workoutLog`;
  }

  update(id: number, updateWorkoutLogDto: UpdateWorkoutLogDto) {
    return `This action updates a #${id} workoutLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} workoutLog`;
  }
}
