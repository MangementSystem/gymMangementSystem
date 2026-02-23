import { IsOptional, IsDateString, IsNumber, IsString } from 'class-validator';

export class UpdateProgressDto {
  @IsOptional()
  @IsDateString()
  date?: Date;

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
