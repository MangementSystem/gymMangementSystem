import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  duration_days?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
