import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiExerciseAnalysisService } from './ai-exercise-analysis.service';
import { CreateAiExerciseAnalysisDto } from './dto/create-ai-exercise-analysis.dto';
import { UpdateAiExerciseAnalysisDto } from './dto/update-ai-exercise-analysis.dto';

@Controller('ai-exercise-analysis')
export class AiExerciseAnalysisController {
  constructor(private readonly aiExerciseAnalysisService: AiExerciseAnalysisService) {}

  @Post()
  create(@Body() createAiExerciseAnalysisDto: CreateAiExerciseAnalysisDto) {
    return this.aiExerciseAnalysisService.create(createAiExerciseAnalysisDto);
  }

  @Get()
  findAll() {
    return this.aiExerciseAnalysisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiExerciseAnalysisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiExerciseAnalysisDto: UpdateAiExerciseAnalysisDto) {
    return this.aiExerciseAnalysisService.update(+id, updateAiExerciseAnalysisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiExerciseAnalysisService.remove(+id);
  }
}
