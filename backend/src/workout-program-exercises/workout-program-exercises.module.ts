import { Module } from '@nestjs/common';
import { WorkoutProgramExercisesService } from './workout-program-exercises.service';
import { WorkoutProgramExercisesController } from './workout-program-exercises.controller';

@Module({
  controllers: [WorkoutProgramExercisesController],
  providers: [WorkoutProgramExercisesService],
})
export class WorkoutProgramExercisesModule {}
