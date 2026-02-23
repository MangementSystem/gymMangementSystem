// store/api/organizationsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { Organization } from './types';
import { createApiBaseQuery } from './baseQuery';

export const organizationsApi = createApi({
  reducerPath: 'organizationsApi',
  baseQuery: createApiBaseQuery('/organizations'),
  tagTypes: ['Organization'],
  endpoints: (builder) => ({
    getOrganizations: builder.query<Organization[], void>({
      query: () => '',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Organization' as const, id })),
              { type: 'Organization', id: 'LIST' },
            ]
          : [{ type: 'Organization', id: 'LIST' }],
    }),

    getOrganizationById: builder.query<Organization, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Organization', id }],
    }),

    createOrganization: builder.mutation<Organization, Partial<Organization>>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Organization', id: 'LIST' }],
    }),

    updateOrganization: builder.mutation<Organization, { id: number; data: Partial<Organization> }>(
      {
        query: ({ id, data }) => ({
          url: `/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: 'Organization', id },
          { type: 'Organization', id: 'LIST' },
        ],
      },
    ),

    deleteOrganization: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Organization', id },
        { type: 'Organization', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationsApi;
