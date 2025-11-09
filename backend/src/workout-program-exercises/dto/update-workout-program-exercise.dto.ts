import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutProgramExerciseDto } from './create-workout-program-exercise.dto';

export class UpdateWorkoutProgramExerciseDto extends PartialType(CreateWorkoutProgramExerciseDto) {}
