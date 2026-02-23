import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsObject,
} from 'class-validator';

export class CreateAiInsightDto {
  @IsNumber()
  memberId: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsObject()
  input_data?: any;

  @IsOptional()
  @IsString()
  ai_recommendation?: string;

  @IsOptional()
  @IsDateString()
  predicted_goal_date?: Date;

  @IsOptional()
  @IsString()
  risk_alert?: string;
}
