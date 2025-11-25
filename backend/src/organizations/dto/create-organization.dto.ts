import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

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
