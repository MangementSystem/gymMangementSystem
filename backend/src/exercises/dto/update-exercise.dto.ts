import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  equipment?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}
