import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAiExerciseAnalysisDto } from './dto/create-ai-exercise-analysis.dto';
import { UpdateAiExerciseAnalysisDto } from './dto/update-ai-exercise-analysis.dto';
import { AnalyzeExerciseFormDto } from './dto/analyze-exercise-form.dto';
import { AiExerciseAnalysis } from './entities/ai-exercise-analysis.entity';

@Injectable()
export class AiExerciseAnalysisService {
  constructor(
    @InjectRepository(AiExerciseAnalysis)
    private aiExerciseAnalysisRepository: Repository<AiExerciseAnalysis>,
  ) {}

  async create(
    createAiExerciseAnalysisDto: CreateAiExerciseAnalysisDto,
  ): Promise<AiExerciseAnalysis> {
    const aiExerciseAnalysis = this.aiExerciseAnalysisRepository.create({
      ...createAiExerciseAnalysisDto,
      member: { id: createAiExerciseAnalysisDto.memberId },
      workout_log: createAiExerciseAnalysisDto.workoutLogId
        ? { id: createAiExerciseAnalysisDto.workoutLogId }
        : undefined,
      exercise: { id: createAiExerciseAnalysisDto.exerciseId },
    });

    return this.aiExerciseAnalysisRepository.save(aiExerciseAnalysis);
  }

  async analyzeExerciseForm(
    analyzeExerciseFormDto: AnalyzeExerciseFormDto,
  ): Promise<AiExerciseAnalysis> {
    console.log('AI exercise analysis request:', {
      memberId: analyzeExerciseFormDto.memberId,
      exerciseId: analyzeExerciseFormDto.exerciseId,
      workoutLogId: analyzeExerciseFormDto.workoutLogId,
    });

    const postureScore = Math.floor(Math.random() * 16) + 80;
    const stabilityScore = Math.floor(Math.random() * 18) + 78;
    const movementEfficiency = Math.floor(Math.random() * 20) + 76;
    const averageScore =
      (postureScore + stabilityScore + movementEfficiency) / 3;

    const riskLevel =
      averageScore >= 85 ? 'low' : averageScore >= 70 ? 'medium' : 'high';

    const recommendedFix =
      riskLevel === 'low'
        ? 'Form is stable. Keep the current tempo and breathing pattern.'
        : riskLevel === 'medium'
          ? 'Focus on core bracing and consistent range of motion for cleaner reps.'
          : 'Reduce load and prioritize controlled form before increasing intensity.';

    const detectedErrors =
      riskLevel === 'low'
        ? []
        : [
            {
              code: 'form_drift',
              message:
                'Minor posture drift detected during concentric movement.',
            },
          ];

    return this.create({
      memberId: analyzeExerciseFormDto.memberId,
      exerciseId: analyzeExerciseFormDto.exerciseId,
      workoutLogId: analyzeExerciseFormDto.workoutLogId,
      posture_score: postureScore,
      stability_score: stabilityScore,
      movement_efficiency: movementEfficiency,
      risk_level: riskLevel,
      recommended_fix: recommendedFix,
      detected_errors: {
        videoUrl: analyzeExerciseFormDto.videoUrl,
        errors: detectedErrors,
      },
    });
  }

  async findAll(
    memberId?: number,
    workoutLogId?: number,
  ): Promise<AiExerciseAnalysis[]> {
    const query = this.aiExerciseAnalysisRepository
      .createQueryBuilder('analysis')
      .leftJoinAndSelect('analysis.member', 'member')
      .leftJoinAndSelect('analysis.workout_log', 'workoutLog')
      .leftJoinAndSelect('analysis.exercise', 'exercise');

    if (memberId) {
      query.andWhere('analysis.member = :memberId', { memberId });
    }

    if (workoutLogId) {
      query.andWhere('analysis.workout_log = :workoutLogId', { workoutLogId });
    }

    return query.orderBy('analysis.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<AiExerciseAnalysis> {
    const aiExerciseAnalysis = await this.aiExerciseAnalysisRepository.findOne({
      where: { id },
      relations: ['member', 'workout_log', 'exercise'],
    });

    if (!aiExerciseAnalysis) {
      throw new NotFoundException(
        `AI exercise analysis with ID ${id} not found`,
      );
    }

    return aiExerciseAnalysis;
  }

  async update(
    id: number,
    updateAiExerciseAnalysisDto: UpdateAiExerciseAnalysisDto,
  ): Promise<AiExerciseAnalysis> {
    const aiExerciseAnalysis = await this.findOne(id);
    const { memberId, workoutLogId, exerciseId, ...rest } =
      updateAiExerciseAnalysisDto;

    Object.assign(aiExerciseAnalysis, rest);

    if (memberId) {
      aiExerciseAnalysis.member = { id: memberId } as any;
    }

    if (workoutLogId) {
      aiExerciseAnalysis.workout_log = { id: workoutLogId } as any;
    }

    if (exerciseId) {
      aiExerciseAnalysis.exercise = { id: exerciseId } as any;
    }

    return this.aiExerciseAnalysisRepository.save(aiExerciseAnalysis);
  }

  async remove(id: number): Promise<void> {
    const aiExerciseAnalysis = await this.findOne(id);
    await this.aiExerciseAnalysisRepository.remove(aiExerciseAnalysis);
  }
}
