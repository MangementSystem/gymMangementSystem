import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class UpdateMembershipDto {
  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsNumber()
  paid_amount?: number;

  @IsOptional()
  @IsNumber()
  remaining_amount?: number;
}
