import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class GenerateAiInsightDto {
  @IsNumber()
  memberId: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsObject()
  inputData?: Record<string, any>;
}
