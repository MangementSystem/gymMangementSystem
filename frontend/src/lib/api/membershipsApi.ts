import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { Membership } from './types';

export interface CreateMembershipRequest {
  organizationId: number;
  memberId: number;
  planId: number;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
}

export interface UpdateMembershipRequest {
  start_date?: string;
  end_date?: string;
  status?: string;
  total_amount?: number;
  paid_amount?: number;
  remaining_amount?: number;
}

export const membershipsApi = createApi({
  reducerPath: 'membershipsApi',
  baseQuery: createApiBaseQuery('/memberships'),
  tagTypes: ['Membership'],
  endpoints: (builder) => ({
    getMemberships: builder.query<
      Membership[],
      { organizationId?: number; memberId?: number; status?: string }
    >({
      query: (params) => ({ url: '', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Membership' as const, id })),
              { type: 'Membership', id: 'LIST' },
            ]
          : [{ type: 'Membership', id: 'LIST' }],
    }),
    getMembershipById: builder.query<Membership, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Membership', id }],
    }),
    createMembership: builder.mutation<Membership, CreateMembershipRequest>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: [{ type: 'Membership', id: 'LIST' }],
    }),
    updateMembership: builder.mutation<Membership, { id: number; data: UpdateMembershipRequest }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Membership', id },
        { type: 'Membership', id: 'LIST' },
      ],
    }),
    renewMembership: builder.mutation<Membership, { id: number; planId: number }>({
      query: ({ id, planId }) => ({
        url: `/${id}/renew`,
        method: 'POST',
        body: { planId },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Membership', id },
        { type: 'Membership', id: 'LIST' },
      ],
    }),
    cancelMembership: builder.mutation<Membership, number>({
      query: (id) => ({ url: `/${id}/cancel`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Membership', id },
        { type: 'Membership', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetMembershipsQuery,
  useGetMembershipByIdQuery,
  useCreateMembershipMutation,
  useUpdateMembershipMutation,
  useRenewMembershipMutation,
  useCancelMembershipMutation,
} = membershipsApi;
