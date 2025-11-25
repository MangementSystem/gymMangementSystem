import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateWorkoutProgramDto {
  @IsNumber()
  memberId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  goal?: string;
}
