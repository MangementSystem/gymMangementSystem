import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { WorkoutLog, WorkoutLogSet } from './types';

const normalizeDateRangeParams = <T extends { startDate?: string; endDate?: string }>(
  params: T,
) => {
  const normalized = { ...params } as T;

  if (normalized.startDate && normalized.startDate.length === 10) {
    normalized.startDate = `${normalized.startDate}T00:00:00` as T['startDate'];
  }

  if (normalized.endDate && normalized.endDate.length === 10) {
    normalized.endDate = `${normalized.endDate}T23:59:59.999` as T['endDate'];
  }

  return normalized;
};

export interface CreateWorkoutLogRequest {
  memberId: number;
  programId?: number;
  date: string;
  ai_summary?: string;
}

export interface CreateWorkoutLogSetRequest {
  workoutLogId: number;
  exerciseId: number;
  set_number?: number;
  reps?: number;
  weight?: number;
  rpe?: number;
}

export const workoutLogsApi = createApi({
  reducerPath: 'workoutLogsApi',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['WorkoutLog', 'LogSet'],
  endpoints: (builder) => ({
    getWorkoutLogs: builder.query<
      WorkoutLog[],
      { memberId?: number; programId?: number; startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: '/workout-logs',
        params: normalizeDateRangeParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WorkoutLog' as const, id })),
              { type: 'WorkoutLog', id: 'LIST' },
            ]
          : [{ type: 'WorkoutLog', id: 'LIST' }],
    }),

    getWorkoutLogById: builder.query<WorkoutLog, number>({
      query: (id) => `/workout-logs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'WorkoutLog', id }],
    }),

    createWorkoutLog: builder.mutation<WorkoutLog, CreateWorkoutLogRequest>({
      query: (body) => ({
        url: '/workout-logs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'WorkoutLog', id: 'LIST' }],
    }),

    updateWorkoutLog: builder.mutation<
      WorkoutLog,
      { id: number; data: Partial<CreateWorkoutLogRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/workout-logs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'WorkoutLog', id },
        { type: 'WorkoutLog', id: 'LIST' },
      ],
    }),

    deleteWorkoutLog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/workout-logs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'WorkoutLog', id },
        { type: 'WorkoutLog', id: 'LIST' },
      ],
    }),

    addSetToLog: builder.mutation<WorkoutLogSet, CreateWorkoutLogSetRequest>({
      query: (body) => ({
        url: '/workout-log-sets',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'WorkoutLog', id: arg.workoutLogId },
        { type: 'LogSet', id: 'LIST' },
      ],
    }),

    updateLogSet: builder.mutation<
      WorkoutLogSet,
      { id: number; data: Partial<CreateWorkoutLogSetRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/workout-log-sets/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'LogSet', id: 'LIST' }],
    }),

    deleteLogSet: builder.mutation<void, number>({
      query: (id) => ({
        url: `/workout-log-sets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'LogSet', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWorkoutLogsQuery,
  useGetWorkoutLogByIdQuery,
  useCreateWorkoutLogMutation,
  useUpdateWorkoutLogMutation,
  useDeleteWorkoutLogMutation,
  useAddSetToLogMutation,
  useUpdateLogSetMutation,
  useDeleteLogSetMutation,
} = workoutLogsApi;
