import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AiInsightsService } from './ai-insights.service';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';
import { GenerateAiInsightDto } from './dto/generate-ai-insight.dto';
import { WorkoutRecommendationDto } from './dto/workout-recommendation.dto';
import { GoalPredictionDto } from './dto/goal-prediction.dto';

@Controller('ai-insights')
export class AiInsightsController {
  constructor(private readonly aiInsightsService: AiInsightsService) {}

  @Post()
  create(@Body() createAiInsightDto: CreateAiInsightDto) {
    return this.aiInsightsService.create(createAiInsightDto);
  }

  @Post('generate')
  generate(@Body() generateAiInsightDto: GenerateAiInsightDto) {
    return this.aiInsightsService.generate(generateAiInsightDto);
  }

  @Post('recommendations/workout')
  generateWorkoutRecommendation(
    @Body() workoutRecommendationDto: WorkoutRecommendationDto,
  ) {
    return this.aiInsightsService.generateWorkoutRecommendation(
      workoutRecommendationDto,
    );
  }

  @Post('predictions/goal-completion')
  predictGoalCompletion(@Body() goalPredictionDto: GoalPredictionDto) {
    return this.aiInsightsService.predictGoalCompletion(goalPredictionDto);
  }

  @Get()
  findAll(
    @Query('memberId') memberId?: string,
    @Query('category') category?: string,
  ) {
    return this.aiInsightsService.findAll(
      memberId ? +memberId : undefined,
      category,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiInsightsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAiInsightDto: UpdateAiInsightDto,
  ) {
    return this.aiInsightsService.update(+id, updateAiInsightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiInsightsService.remove(+id);
  }
}
