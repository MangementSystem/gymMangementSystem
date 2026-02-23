import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';
import { GenerateAiInsightDto } from './dto/generate-ai-insight.dto';
import { GoalPredictionDto } from './dto/goal-prediction.dto';
import { WorkoutRecommendationDto } from './dto/workout-recommendation.dto';
import { AiInsight } from './entities/ai-insight.entity';

@Injectable()
export class AiInsightsService {
  constructor(
    @InjectRepository(AiInsight)
    private aiInsightRepository: Repository<AiInsight>,
  ) {}

  async create(createAiInsightDto: CreateAiInsightDto): Promise<AiInsight> {
    const aiInsight = this.aiInsightRepository.create({
      ...createAiInsightDto,
      member: { id: createAiInsightDto.memberId },
    });

    return this.aiInsightRepository.save(aiInsight);
  }

  async generate(
    generateAiInsightDto: GenerateAiInsightDto,
  ): Promise<AiInsight> {
    console.log('AI insight generation request:', {
      memberId: generateAiInsightDto.memberId,
      category: generateAiInsightDto.category,
    });

    const category = generateAiInsightDto.category.toLowerCase();

    const recommendationByCategory: Record<string, string> = {
      performance:
        'Increase training intensity by 5-10% while keeping form quality stable.',
      nutrition:
        'Add a post-workout protein and carbohydrate window for faster recovery.',
      recovery:
        'Schedule one additional recovery day this week to avoid accumulated fatigue.',
      goals:
        'Current trend supports target completion if workout consistency remains above 85%.',
    };

    const aiRecommendation =
      recommendationByCategory[category] ||
      'Maintain consistency and review progress metrics weekly for gradual improvements.';

    return this.create({
      memberId: generateAiInsightDto.memberId,
      category: generateAiInsightDto.category,
      input_data: generateAiInsightDto.inputData,
      ai_recommendation: aiRecommendation,
      predicted_goal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      risk_alert:
        category === 'recovery'
          ? 'Recovery trend is below optimal threshold. Monitor overtraining risk.'
          : undefined,
    });
  }

  async generateWorkoutRecommendation(
    workoutRecommendationDto: WorkoutRecommendationDto,
  ) {
    return {
      memberId: workoutRecommendationDto.memberId,
      goals: workoutRecommendationDto.goals ?? [],
      recommendation:
        'Prioritize compound lifts early in the week and schedule cardio after strength blocks.',
      focusAreas: ['progressive-overload', 'recovery', 'mobility'],
      generatedAt: new Date().toISOString(),
    };
  }

  async predictGoalCompletion(goalPredictionDto: GoalPredictionDto) {
    console.log('AI goal prediction request:', goalPredictionDto);

    const estimatedDays = 45;
    return {
      memberId: goalPredictionDto.memberId,
      goalType: goalPredictionDto.goalType,
      estimatedCompletionDate: new Date(
        Date.now() + estimatedDays * 24 * 60 * 60 * 1000,
      ).toISOString(),
      confidence: 0.82,
      generatedAt: new Date().toISOString(),
    };
  }

  async findAll(memberId?: number, category?: string): Promise<AiInsight[]> {
    const query = this.aiInsightRepository
      .createQueryBuilder('insight')
      .leftJoinAndSelect('insight.member', 'member');

    if (memberId) {
      query.andWhere('insight.member = :memberId', { memberId });
    }

    if (category) {
      query.andWhere('LOWER(insight.category) = LOWER(:category)', {
        category,
      });
    }

    return query.orderBy('insight.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<AiInsight> {
    const aiInsight = await this.aiInsightRepository.findOne({
      where: { id },
      relations: ['member'],
    });

    if (!aiInsight) {
      throw new NotFoundException(`AI insight with ID ${id} not found`);
    }

    return aiInsight;
  }

  async update(id: number, updateAiInsightDto: UpdateAiInsightDto) {
    const aiInsight = await this.findOne(id);
    const { memberId, ...rest } = updateAiInsightDto;

    Object.assign(aiInsight, rest);

    if (memberId) {
      aiInsight.member = { id: memberId } as any;
    }

    return this.aiInsightRepository.save(aiInsight);
  }

  async remove(id: number): Promise<void> {
    const aiInsight = await this.findOne(id);
    await this.aiInsightRepository.remove(aiInsight);
  }
}
