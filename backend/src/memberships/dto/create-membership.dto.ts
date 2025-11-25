import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateMembershipDto {
  @IsNumber()
  organizationId: number;

  @IsNumber()
  memberId: number;

  @IsNumber()
  planId: number;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsString()
  status: string;

  @IsNumber()
  total_amount: number;

  @IsNumber()
  paid_amount: number;

  @IsNumber()
  remaining_amount: number;
}
