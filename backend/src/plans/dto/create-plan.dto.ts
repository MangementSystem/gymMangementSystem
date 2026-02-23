import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsNumber()
  duration_days: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
