import { IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateWorkoutLogDto {
  @IsNumber()
  memberId: number;

  @IsOptional()
  @IsNumber()
  programId?: number;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  ai_summary?: string;
}
