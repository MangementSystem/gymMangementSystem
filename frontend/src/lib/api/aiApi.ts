import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { AiExerciseAnalysis, AiInsight } from './types';

export interface CreateAiExerciseAnalysisRequest {
  memberId: number;
  workoutLogId?: number;
  exerciseId: number;
  posture_score?: number;
  stability_score?: number;
  movement_efficiency?: number;
  risk_level?: string;
  detected_errors?: Record<string, any>;
  recommended_fix?: string;
}

export interface AnalyzeExerciseFormRequest {
  videoUrl?: string;
  exerciseId: number;
  memberId: number;
  workoutLogId?: number;
}

export interface GenerateInsightRequest {
  memberId: number;
  category: string;
  inputData?: Record<string, any>;
}

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['ExerciseAnalysis', 'AiInsight'],
  endpoints: (builder) => ({
    getExerciseAnalyses: builder.query<
      AiExerciseAnalysis[],
      { memberId?: number; workoutLogId?: number }
    >({
      query: (params) => ({ url: '/ai-exercise-analysis', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ExerciseAnalysis' as const, id })),
              { type: 'ExerciseAnalysis', id: 'LIST' },
            ]
          : [{ type: 'ExerciseAnalysis', id: 'LIST' }],
    }),

    getExerciseAnalysisById: builder.query<AiExerciseAnalysis, number>({
      query: (id) => `/ai-exercise-analysis/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ExerciseAnalysis', id }],
    }),

    createExerciseAnalysis: builder.mutation<AiExerciseAnalysis, CreateAiExerciseAnalysisRequest>({
      query: (body) => ({
        url: '/ai-exercise-analysis',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ExerciseAnalysis', id: 'LIST' }],
    }),

    analyzeExerciseForm: builder.mutation<AiExerciseAnalysis, AnalyzeExerciseFormRequest>({
      query: (body) => ({
        url: '/ai-exercise-analysis/analyze',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ExerciseAnalysis', id: 'LIST' }],
    }),

    getAiInsights: builder.query<AiInsight[], { memberId?: number; category?: string }>({
      query: (params) => ({
        url: '/ai-insights',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'AiInsight' as const, id })),
              { type: 'AiInsight', id: 'LIST' },
            ]
          : [{ type: 'AiInsight', id: 'LIST' }],
    }),

    getAiInsightById: builder.query<AiInsight, number>({
      query: (id) => `/ai-insights/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'AiInsight', id }],
    }),

    generateInsight: builder.mutation<AiInsight, GenerateInsightRequest>({
      query: (body) => ({
        url: '/ai-insights/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AiInsight', id: 'LIST' }],
    }),

    generateWorkoutRecommendation: builder.mutation<any, { memberId: number; goals: string[] }>({
      query: (body) => ({
        url: '/ai-insights/recommendations/workout',
        method: 'POST',
        body,
      }),
    }),

    predictGoalCompletion: builder.mutation<any, { memberId: number; goalType: string }>({
      query: (body) => ({
        url: '/ai-insights/predictions/goal-completion',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetExerciseAnalysesQuery,
  useGetExerciseAnalysisByIdQuery,
  useCreateExerciseAnalysisMutation,
  useAnalyzeExerciseFormMutation,
  useGetAiInsightsQuery,
  useGetAiInsightByIdQuery,
  useGenerateInsightMutation,
  useGenerateWorkoutRecommendationMutation,
  usePredictGoalCompletionMutation,
} = aiApi;
