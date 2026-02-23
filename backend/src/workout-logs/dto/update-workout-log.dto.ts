import { IsOptional, IsDateString, IsString } from 'class-validator';

export class UpdateWorkoutLogDto {
  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsString()
  ai_summary?: string;
}
