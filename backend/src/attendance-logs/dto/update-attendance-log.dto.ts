import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateAttendanceLogDto {
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
