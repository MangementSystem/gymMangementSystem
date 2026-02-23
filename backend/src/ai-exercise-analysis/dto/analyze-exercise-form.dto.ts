import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AnalyzeExerciseFormDto {
  @IsNumber()
  memberId: number;

  @IsNumber()
  exerciseId: number;

  @IsOptional()
  @IsNumber()
  workoutLogId?: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;
}
