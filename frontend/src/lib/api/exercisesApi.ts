// store/api/exercisesApi.ts
import { createApi as createApi4, fetchBaseQuery as fetchBaseQuery4 } from "@reduxjs/toolkit/query/react";
import type { Exercise } from "../../../../backend/src/exercises/entities/exercise.entity";


const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const exercisesApi = createApi4({
  reducerPath: "exercisesApi",
  baseQuery: fetchBaseQuery4({ baseUrl: `${baseUrl}/exercises`, credentials: "include" }),
  tagTypes: ["Exercise"],
  endpoints: (builder) => ({
    getExercises: builder.query<Exercise[], { category?: string; equipment?: string }>({
      query: (params) => ({ url: "", params }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Exercise" as const, id })), { type: "Exercise", id: "LIST" }] : [{ type: "Exercise", id: "LIST" }],
    }),
    getExerciseById: builder.query<Exercise, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Exercise", id }],
    }),
    createExercise: builder.mutation<Exercise, Partial<Exercise>>({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: [{ type: "Exercise", id: "LIST" }],
    }),
    updateExercise: builder.mutation<Exercise, { id: number; data: Partial<Exercise> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Exercise", id }, { type: "Exercise", id: "LIST" }],
    }),
  }),
});

export const { useGetExercisesQuery, useGetExerciseByIdQuery, useCreateExerciseMutation, useUpdateExerciseMutation } = exercisesApi;
