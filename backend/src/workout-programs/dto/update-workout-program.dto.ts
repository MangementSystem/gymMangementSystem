import { IsOptional, IsString } from 'class-validator';

export class UpdateWorkoutProgramDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  goal?: string;
}
