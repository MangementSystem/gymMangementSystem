import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { Progress } from './types';

export interface CreateProgressRequest {
  memberId: number;
  date: string;
  weight?: number;
  body_fat?: number;
  muscle_mass?: number;
  ai_feedback?: string;
}

export const progressApi = createApi({
  reducerPath: 'progressApi',
  baseQuery: createApiBaseQuery('/progress'),
  tagTypes: ['Progress'],
  endpoints: (builder) => ({
    getProgress: builder.query<
      Progress[],
      { memberId: number; startDate?: string; endDate?: string }
    >({
      query: (params) => ({ url: '', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Progress' as const, id })),
              { type: 'Progress', id: 'LIST' },
            ]
          : [{ type: 'Progress', id: 'LIST' }],
    }),
    createProgress: builder.mutation<Progress, CreateProgressRequest>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: [{ type: 'Progress', id: 'LIST' }],
    }),
  }),
});

export const { useGetProgressQuery, useCreateProgressMutation } = progressApi;
