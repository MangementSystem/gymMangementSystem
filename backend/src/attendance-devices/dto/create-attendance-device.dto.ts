import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAttendanceDeviceDto {
  @IsString()
  name: string;

  @IsString()
  serial_number: string;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
