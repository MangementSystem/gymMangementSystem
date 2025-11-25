
// store/api/progressApi.ts
import { createApi as createApi5, fetchBaseQuery as fetchBaseQuery5 } from "@reduxjs/toolkit/query/react";
import type { Progress } from "../../../../backend/src/progress/entities/progress.entity";


const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const progressApi = createApi5({
  reducerPath: "progressApi",
  baseQuery: fetchBaseQuery5({ baseUrl: `${baseUrl}/progress`, credentials: "include" }),
  tagTypes: ["Progress"],
  endpoints: (builder) => ({
    getProgress: builder.query<Progress[], { memberId: number; startDate?: string; endDate?: string }>({
      query: (params) => ({ url: "", params }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Progress" as const, id })), { type: "Progress", id: "LIST" }] : [{ type: "Progress", id: "LIST" }],
    }),
    createProgress: builder.mutation<Progress, Partial<Progress>>({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: [{ type: "Progress", id: "LIST" }],
    }),
  }),
});

export const { useGetProgressQuery, useCreateProgressMutation } = progressApi;
