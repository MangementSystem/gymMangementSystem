import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutLogSetDto } from './create-workout-log-set.dto';

export class UpdateWorkoutLogSetDto extends PartialType(
  CreateWorkoutLogSetDto,
) {}
