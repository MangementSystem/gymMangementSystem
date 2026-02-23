import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateAttendanceLogDto {
  @IsNumber()
  memberId: number;

  @IsOptional()
  @IsNumber()
  deviceId?: number;

  @IsOptional()
  @IsNumber()
  organizationId?: number;

  @IsOptional()
  @IsDateString()
  check_in?: Date;

  @IsOptional()
  @IsDateString()
  check_out?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
