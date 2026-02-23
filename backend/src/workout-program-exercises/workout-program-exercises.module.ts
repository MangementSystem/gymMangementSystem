import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutProgramExercisesService } from './workout-program-exercises.service';
import { WorkoutProgramExercisesController } from './workout-program-exercises.controller';
import { WorkoutProgramExercise } from './entities/workout-program-exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutProgramExercise])],
  controllers: [WorkoutProgramExercisesController],
  providers: [WorkoutProgramExercisesService],
  exports: [WorkoutProgramExercisesService],
})
export class WorkoutProgramExercisesModule {}
