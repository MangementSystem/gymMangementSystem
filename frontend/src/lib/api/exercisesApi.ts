import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { Exercise } from './types';

export const exercisesApi = createApi({
  reducerPath: 'exercisesApi',
  baseQuery: createApiBaseQuery('/exercises'),
  tagTypes: ['Exercise'],
  endpoints: (builder) => ({
    getExercises: builder.query<Exercise[], { category?: string; equipment?: string }>({
      query: (params) => ({ url: '', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Exercise' as const, id })),
              { type: 'Exercise', id: 'LIST' },
            ]
          : [{ type: 'Exercise', id: 'LIST' }],
    }),
    getExerciseById: builder.query<Exercise, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Exercise', id }],
    }),
    createExercise: builder.mutation<Exercise, Partial<Exercise>>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: [{ type: 'Exercise', id: 'LIST' }],
    }),
    updateExercise: builder.mutation<Exercise, { id: number; data: Partial<Exercise> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Exercise', id },
        { type: 'Exercise', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetExercisesQuery,
  useGetExerciseByIdQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
} = exercisesApi;
