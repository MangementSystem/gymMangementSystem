import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { Plan } from './types';

export interface CreatePlanRequest {
  name: string;
  duration_days: number;
  price: number;
  description?: string;
  organizationId?: number;
}

export interface UpdatePlanRequest {
  name?: string;
  duration_days?: number;
  price?: number;
  description?: string;
}

export const plansApi = createApi({
  reducerPath: 'plansApi',
  baseQuery: createApiBaseQuery('/plans'),
  tagTypes: ['Plan'],
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], { organizationId?: number }>({
      query: (params) => ({ url: '', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Plan' as const, id })),
              { type: 'Plan', id: 'LIST' },
            ]
          : [{ type: 'Plan', id: 'LIST' }],
    }),
    getPlanById: builder.query<Plan, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Plan', id }],
    }),
    createPlan: builder.mutation<Plan, CreatePlanRequest>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: [{ type: 'Plan', id: 'LIST' }],
    }),
    updatePlan: builder.mutation<Plan, { id: number; data: UpdatePlanRequest }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Plan', id },
        { type: 'Plan', id: 'LIST' },
      ],
    }),
    deletePlan: builder.mutation<void, number>({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Plan', id },
        { type: 'Plan', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;
