import {
  IsOptional,
  IsString,
  IsDateString,
  IsEmail,
  IsNumber,
  IsObject,
} from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  join_date?: Date;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsObject()
  ai_profile?: any;

  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
