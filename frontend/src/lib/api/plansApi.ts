// store/api/plansApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Plan } from "../../../../backend/src/plans/entities/plan.entity";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/plans`, credentials: "include" }),
  tagTypes: ["Plan"],
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], { organizationId?: number }>({
      query: (params) => ({ url: "", params }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Plan" as const, id })), { type: "Plan", id: "LIST" }] : [{ type: "Plan", id: "LIST" }],
    }),
    getPlanById: builder.query<Plan, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Plan", id }],
    }),
    createPlan: builder.mutation<Plan, Partial<Plan>>({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: [{ type: "Plan", id: "LIST" }],
    }),
    updatePlan: builder.mutation<Plan, { id: number; data: Partial<Plan> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Plan", id }, { type: "Plan", id: "LIST" }],
    }),
    deletePlan: builder.mutation<void, number>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [{ type: "Plan", id }, { type: "Plan", id: "LIST" }],
    }),
  }),
});

export const { useGetPlansQuery, useGetPlanByIdQuery, useCreatePlanMutation, useUpdatePlanMutation, useDeletePlanMutation } = plansApi;




