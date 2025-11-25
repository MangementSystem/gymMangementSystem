import { IsNumber, IsOptional } from 'class-validator';

export class CreateWorkoutLogSetDto {
  @IsNumber()
  workoutLogId: number;

  @IsNumber()
  exerciseId: number;

  @IsOptional()
  @IsNumber()
  set_number?: number;

  @IsOptional()
  @IsNumber()
  reps?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  rpe?: number;
}
