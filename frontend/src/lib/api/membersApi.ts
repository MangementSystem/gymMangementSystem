// store/api/membersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Member } from "../../../../backend/src/members/entities/member.entity";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const membersApi = createApi({
  reducerPath: "membersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/members`,
    credentials: "include",
  }),
  tagTypes: ["Member"],
  endpoints: (builder) => ({
    getMembers: builder.query<Member[], { organizationId?: number }>({
      query: ({ organizationId }) => ({
        url: "",
        params: organizationId ? { organizationId } : {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Member" as const, id })),
              { type: "Member", id: "LIST" },
            ]
          : [{ type: "Member", id: "LIST" }],
    }),
    
    getMemberById: builder.query<Member, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Member", id }],
    }),
    
    createMember: builder.mutation<Member, Partial<Member>>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Member", id: "LIST" }],
    }),
    
    updateMember: builder.mutation<Member, { id: number; data: Partial<Member> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Member", id },
        { type: "Member", id: "LIST" },
      ],
    }),
    
    deleteMember: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Member", id },
        { type: "Member", id: "LIST" },
      ],
    }),
    
    getMemberStats: builder.query<any, number>({
      query: (id) => `/${id}/stats`,
      providesTags: (result, error, id) => [{ type: "Member", id }],
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