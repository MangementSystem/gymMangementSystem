// store/api/membersApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { Member } from './types';
import { createApiBaseQuery } from './baseQuery';

export interface CreateMemberRequest {
  first_name: string;
  last_name: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  join_date?: string;
  goal?: string;
  weight?: number;
  height?: number;
  ai_profile?: Record<string, any>;
  organizationId?: number;
}

export interface UpdateMemberRequest {
  first_name?: string;
  last_name?: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  join_date?: string;
  goal?: string;
  weight?: number;
  height?: number;
  ai_profile?: Record<string, any>;
  organizationId?: number;
}

export const membersApi = createApi({
  reducerPath: 'membersApi',
  baseQuery: createApiBaseQuery('/members'),
  tagTypes: ['Member'],
  endpoints: (builder) => ({
    getMembers: builder.query<Member[], { organizationId?: number }>({
      query: ({ organizationId }) => ({
        url: '',
        params: organizationId ? { organizationId } : {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Member' as const, id })),
              { type: 'Member', id: 'LIST' },
            ]
          : [{ type: 'Member', id: 'LIST' }],
    }),

    getMemberById: builder.query<Member, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Member', id }],
    }),

    createMember: builder.mutation<Member, CreateMemberRequest>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Member', id: 'LIST' }],
    }),

    updateMember: builder.mutation<Member, { id: number; data: UpdateMemberRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Member', id },
        { type: 'Member', id: 'LIST' },
      ],
    }),

    deleteMember: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Member', id },
        { type: 'Member', id: 'LIST' },
      ],
    }),

    getMemberStats: builder.query<any, number>({
      query: (id) => `/${id}/stats`,
      providesTags: (result, error, id) => [{ type: 'Member', id }],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberByIdQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetMemberStatsQuery,
} = membersApi;
