import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutProgramExerciseDto {
  @IsNumber()
  programId: number;

  @IsNumber()
  exerciseId: number;

  @IsOptional()
  @IsNumber()
  sets?: number;

  @IsOptional()
  @IsNumber()
  reps?: number;

  @IsOptional()
  @IsNumber()
  target_weight?: number;

  @IsOptional()
  @IsString()
  day_of_week?: string;
}
