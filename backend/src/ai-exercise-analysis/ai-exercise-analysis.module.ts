import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiExerciseAnalysisService } from './ai-exercise-analysis.service';
import { AiExerciseAnalysisController } from './ai-exercise-analysis.controller';
import { AiExerciseAnalysis } from './entities/ai-exercise-analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiExerciseAnalysis])],
  controllers: [AiExerciseAnalysisController],
  providers: [AiExerciseAnalysisService],
  exports: [AiExerciseAnalysisService],
})
export class AiExerciseAnalysisModule {}
