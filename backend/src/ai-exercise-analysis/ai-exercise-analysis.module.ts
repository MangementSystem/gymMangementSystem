import { Module } from '@nestjs/common';
import { AiExerciseAnalysisService } from './ai-exercise-analysis.service';
import { AiExerciseAnalysisController } from './ai-exercise-analysis.controller';

@Module({
  controllers: [AiExerciseAnalysisController],
  providers: [AiExerciseAnalysisService],
})
export class AiExerciseAnalysisModule {}
