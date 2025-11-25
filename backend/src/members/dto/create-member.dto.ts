import { IsString, IsNumber, IsOptional, IsDateString, IsEmail, IsObject } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

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

  // ملاحظة: العلاقة مع organization عادة تكون عبر organizationId
  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
