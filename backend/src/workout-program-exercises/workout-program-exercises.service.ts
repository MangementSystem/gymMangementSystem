import { Injectable } from '@nestjs/common';
import { CreateWorkoutProgramExerciseDto } from './dto/create-workout-program-exercise.dto';
import { UpdateWorkoutProgramExerciseDto } from './dto/update-workout-program-exercise.dto';

@Injectable()
export class WorkoutProgramExercisesService {
  create(createWorkoutProgramExerciseDto: CreateWorkoutProgramExerciseDto) {
    return 'This action adds a new workoutProgramExercise';
  }

  findAll() {
    return `This action returns all workoutProgramExercises`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workoutProgramExercise`;
  }

  update(id: number, updateWorkoutProgramExerciseDto: UpdateWorkoutProgramExerciseDto) {
    return `This action updates a #${id} workoutProgramExercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} workoutProgramExercise`;
  }
}
