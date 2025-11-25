// store/api/workoutProgramsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { WorkoutProgram } from "../../../../backend/src/workout-programs/entities/workout-program.entity";
import type { WorkoutProgramExercise } from "../../../../backend/src/workout-program-exercises/entities/workout-program-exercise.entity";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const workoutProgramsApi = createApi({
  reducerPath: "workoutProgramsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/workout-programs`,
    credentials: "include",
  }),
  tagTypes: ["WorkoutProgram", "ProgramExercise"],
  endpoints: (builder) => ({
    getWorkoutPrograms: builder.query<WorkoutProgram[], { memberId?: number }>({
      query: ({ memberId }) => ({
        url: "",
        params: memberId ? { memberId } : {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "WorkoutProgram" as const, id })),
              { type: "WorkoutProgram", id: "LIST" },
            ]
          : [{ type: "WorkoutProgram", id: "LIST" }],
    }),
    
    getWorkoutProgramById: builder.query<WorkoutProgram, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "WorkoutProgram", id }],
    }),
    
    createWorkoutProgram: builder.mutation<WorkoutProgram, Partial<WorkoutProgram>>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "WorkoutProgram", id: "LIST" }],
    }),
    
    updateWorkoutProgram: builder.mutation<WorkoutProgram, { id: number; data: Partial<WorkoutProgram> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "WorkoutProgram", id },
        { type: "WorkoutProgram", id: "LIST" },
      ],
    }),
    
    deleteWorkoutProgram: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "WorkoutProgram", id },
        { type: "WorkoutProgram", id: "LIST" },
      ],
    }),
    
    addExerciseToProgram: builder.mutation<WorkoutProgramExercise, Partial<WorkoutProgramExercise>>({
      query: (body) => ({
        url: "/exercises",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "WorkoutProgram", id: arg.program?.id },
        { type: "ProgramExercise", id: "LIST" },
      ],
    }),
    
    updateProgramExercise: builder.mutation<WorkoutProgramExercise, { id: number; data: Partial<WorkoutProgramExercise> }>({
      query: ({ id, data }) => ({
        url: `/exercises/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "ProgramExercise", id: "LIST" }],
    }),
    
    removeProgramExercise: builder.mutation<void, number>({
      query: (id) => ({
        url: `/exercises/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ProgramExercise", id: "LIST" }],
    }),
  }),
});

export const {
  useGetWorkoutProgramsQuery,
  useGetWorkoutProgramByIdQuery,
  useCreateWorkoutProgramMutation,
  useUpdateWorkoutProgramMutation,
  useDeleteWorkoutProgramMutation,
  useAddExerciseToProgramMutation,
  useUpdateProgramExerciseMutation,
  useRemoveProgramExerciseMutation,
} = workoutProgramsApi;