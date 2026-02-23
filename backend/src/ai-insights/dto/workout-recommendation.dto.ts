import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class WorkoutRecommendationDto {
  @IsNumber()
  memberId: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  goals?: string[];
}
