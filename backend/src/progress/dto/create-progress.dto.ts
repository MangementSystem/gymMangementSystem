import { IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateProgressDto {
  @IsNumber()
  memberId: number;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  body_fat?: number;

  @IsOptional()
  @IsNumber()
  muscle_mass?: number;

  @IsOptional()
  @IsString()
  ai_feedback?: string;
}
