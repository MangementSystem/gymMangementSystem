import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { WorkoutProgram, WorkoutProgramExercise } from './types';

export interface CreateWorkoutProgramRequest {
  memberId: number;
  name: string;
  goal?: string;
}

export interface CreateWorkoutProgramExerciseRequest {
  programId: number;
  exerciseId: number;
  sets?: number;
  reps?: number;
  target_weight?: number;
  day_of_week?: string;
}

export const workoutProgramsApi = createApi({
  reducerPath: 'workoutProgramsApi',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['WorkoutProgram', 'ProgramExercise'],
  endpoints: (builder) => ({
    getWorkoutPrograms: builder.query<WorkoutProgram[], { memberId?: number }>({
      query: ({ memberId }) => ({
        url: '/workout-programs',
        params: memberId ? { memberId } : {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WorkoutProgram' as const, id })),
              { type: 'WorkoutProgram', id: 'LIST' },
            ]
          : [{ type: 'WorkoutProgram', id: 'LIST' }],
    }),

    getWorkoutProgramById: builder.query<WorkoutProgram, number>({
      query: (id) => `/workout-programs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'WorkoutProgram', id }],
    }),

    createWorkoutProgram: builder.mutation<WorkoutProgram, CreateWorkoutProgramRequest>({
      query: (body) => ({
        url: '/workout-programs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'WorkoutProgram', id: 'LIST' }],
    }),

    updateWorkoutProgram: builder.mutation<
      WorkoutProgram,
      { id: number; data: Partial<CreateWorkoutProgramRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/workout-programs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'WorkoutProgram', id },
        { type: 'WorkoutProgram', id: 'LIST' },
      ],
    }),

    deleteWorkoutProgram: builder.mutation<void, number>({
      query: (id) => ({
        url: `/workout-programs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'WorkoutProgram', id },
        { type: 'WorkoutProgram', id: 'LIST' },
      ],
    }),

    addExerciseToProgram: builder.mutation<
      WorkoutProgramExercise,
      CreateWorkoutProgramExerciseRequest
    >({
      query: (body) => ({
        url: '/workout-program-exercises',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { programId }) => [
        { type: 'WorkoutProgram', id: programId },
        { type: 'ProgramExercise', id: 'LIST' },
      ],
    }),

    updateProgramExercise: builder.mutation<
      WorkoutProgramExercise,
      { id: number; data: Partial<CreateWorkoutProgramExerciseRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/workout-program-exercises/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'ProgramExercise', id: 'LIST' }],
    }),

    removeProgramExercise: builder.mutation<void, number>({
      query: (id) => ({
        url: `/workout-program-exercises/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ProgramExercise', id: 'LIST' }],
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
