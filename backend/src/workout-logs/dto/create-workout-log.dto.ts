import { IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutLogDto {
  @IsNumber()
  memberId: number;

  @IsNumber()
  programId: number;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  ai_summary?: string;
}
