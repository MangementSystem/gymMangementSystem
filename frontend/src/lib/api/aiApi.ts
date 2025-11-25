// store/api/aiApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AiExerciseAnalysis } from "../../../../backend/src/ai-exercise-analysis/entities/ai-exercise-analysis.entity";
import type { AiInsight } from "../../../../backend/src/ai-insights/entities/ai-insight.entity";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/ai`,
    credentials: "include",
  }),
  tagTypes: ["ExerciseAnalysis", "AiInsight"],
  endpoints: (builder) => ({
    getExerciseAnalyses: builder.query<AiExerciseAnalysis[], { memberId?: number; workoutLogId?: number }>({
      query: (params) => ({
        url: "/exercise-analysis",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ExerciseAnalysis" as const, id })),
              { type: "ExerciseAnalysis", id: "LIST" },
            ]
          : [{ type: "ExerciseAnalysis", id: "LIST" }],
    }),
    
    getExerciseAnalysisById: builder.query<AiExerciseAnalysis, number>({
      query: (id) => `/exercise-analysis/${id}`,
      providesTags: (result, error, id) => [{ type: "ExerciseAnalysis", id }],
    }),
    
    createExerciseAnalysis: builder.mutation<AiExerciseAnalysis, Partial<AiExerciseAnalysis>>({
      query: (body) => ({
        url: "/exercise-analysis",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ExerciseAnalysis", id: "LIST" }],
    }),
    
    analyzeExerciseForm: builder.mutation<AiExerciseAnalysis, { videoUrl: string; exerciseId: number; memberId: number }>({
      query: (body) => ({
        url: "/exercise-analysis/analyze",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ExerciseAnalysis", id: "LIST" }],
    }),
    
    getAiInsights: builder.query<AiInsight[], { memberId?: number; category?: string }>({
      query: (params) => ({
        url: "/insights",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "AiInsight" as const, id })),
              { type: "AiInsight", id: "LIST" },
            ]
          : [{ type: "AiInsight", id: "LIST" }],
    }),
    
    getAiInsightById: builder.query<AiInsight, number>({
      query: (id) => `/insights/${id}`,
      providesTags: (result, error, id) => [{ type: "AiInsight", id }],
    }),
    
    generateInsight: builder.mutation<AiInsight, { memberId: number; category: string; inputData: any }>({
      query: (body) => ({
        url: "/insights/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AiInsight", id: "LIST" }],
    }),
    
    generateWorkoutRecommendation: builder.mutation<any, { memberId: number; goals: string[] }>({
      query: (body) => ({
        url: "/recommendations/workout",
        method: "POST",
        body,
      }),
    }),
    
    predictGoalCompletion: builder.mutation<any, { memberId: number; goalType: string }>({
      query: (body) => ({
        url: "/predictions/goal-completion",
        method: "POST",
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