import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
