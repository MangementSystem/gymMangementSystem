import { PartialType } from '@nestjs/mapped-types';
import { CreateAiExerciseAnalysisDto } from './create-ai-exercise-analysis.dto';

export class UpdateAiExerciseAnalysisDto extends PartialType(
  CreateAiExerciseAnalysisDto,
) {}
