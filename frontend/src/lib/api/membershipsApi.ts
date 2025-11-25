// store/api/membershipsApi.ts
import { createApi as createApi2, fetchBaseQuery as fetchBaseQuery2 } from "@reduxjs/toolkit/query/react";
import type { Membership } from "../../../../backend/src/memberships/entities/membership.entity";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const membershipsApi = createApi2({
  reducerPath: "membershipsApi",
  baseQuery: fetchBaseQuery2({ baseUrl: `${baseUrl}/memberships`, credentials: "include" }),
  tagTypes: ["Membership"],
  endpoints: (builder) => ({
    getMemberships: builder.query<Membership[], { organizationId?: number; memberId?: number; status?: string }>({
      query: (params) => ({ url: "", params }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Membership" as const, id })), { type: "Membership", id: "LIST" }] : [{ type: "Membership", id: "LIST" }],
    }),
    getMembershipById: builder.query<Membership, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Membership", id }],
    }),
    createMembership: builder.mutation<Membership, Partial<Membership>>({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: [{ type: "Membership", id: "LIST" }],
    }),
    updateMembership: builder.mutation<Membership, { id: number; data: Partial<Membership> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Membership", id }, { type: "Membership", id: "LIST" }],
    }),
    renewMembership: builder.mutation<Membership, { id: number; planId: number }>({
      query: ({ id, planId }) => ({ url: `/${id}/renew`, method: "POST", body: { planId } }),
      invalidatesTags: (result, error, { id }) => [{ type: "Membership", id }, { type: "Membership", id: "LIST" }],
    }),
    cancelMembership: builder.mutation<Membership, number>({
      query: (id) => ({ url: `/${id}/cancel`, method: "POST" }),
      invalidatesTags: (result, error, id) => [{ type: "Membership", id }, { type: "Membership", id: "LIST" }],
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
