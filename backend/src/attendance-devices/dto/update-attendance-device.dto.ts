import { IsOptional, IsString } from 'class-validator';

export class UpdateAttendanceDeviceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  serial_number?: string;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
