import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  owner_id?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
