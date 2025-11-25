import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  organizationId: number;

  @IsNumber()
  membershipId: number;

  @IsNumber()
  memberId: number;

  @IsString()
  type: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  amount: number;

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
