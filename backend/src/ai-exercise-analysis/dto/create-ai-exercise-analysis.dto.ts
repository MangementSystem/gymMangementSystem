import { IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateAiExerciseAnalysisDto {
  @IsNumber()
  memberId: number;

  @IsNumber()
  workoutLogId: number;

  @IsNumber()
  exerciseId: number;

  @IsOptional()
  @IsNumber()
  posture_score?: number;

  @IsOptional()
  @IsNumber()
  stability_score?: number;

  @IsOptional()
  @IsNumber()
  movement_efficiency?: number;

  @IsOptional()
  @IsString()
  risk_level?: string;

  @IsOptional()
  @IsObject()
  detected_errors?: any;

  @IsOptional()
  @IsString()
  recommended_fix?: string;
}
