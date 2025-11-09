import { Injectable } from '@nestjs/common';
import { CreateAiExerciseAnalysisDto } from './dto/create-ai-exercise-analysis.dto';
import { UpdateAiExerciseAnalysisDto } from './dto/update-ai-exercise-analysis.dto';

@Injectable()
export class AiExerciseAnalysisService {
  create(createAiExerciseAnalysisDto: CreateAiExerciseAnalysisDto) {
    return 'This action adds a new aiExerciseAnalysis';
  }

  findAll() {
    return `This action returns all aiExerciseAnalysis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiExerciseAnalysis`;
  }

  update(id: number, updateAiExerciseAnalysisDto: UpdateAiExerciseAnalysisDto) {
    return `This action updates a #${id} aiExerciseAnalysis`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiExerciseAnalysis`;
  }
}
