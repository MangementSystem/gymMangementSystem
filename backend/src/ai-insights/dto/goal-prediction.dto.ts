import { IsNumber, IsString } from 'class-validator';

export class GoalPredictionDto {
  @IsNumber()
  memberId: number;

  @IsString()
  goalType: string;
}
