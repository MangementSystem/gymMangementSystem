import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @IsNumber()
  organizationId: number;

  @IsString()
  name: string;

  @IsNumber()
  duration_days: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
