// store/api/workoutLogsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { WorkoutLog } from "../../../../backend/src/workout-logs/entities/workout-log.entity";
import type { WorkoutLogSet } from "../../../../backend/src/workout-log-sets/entities/workout-log-set.entity";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const workoutLogsApi = createApi({
  reducerPath: "workoutLogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/workout-logs`,
    credentials: "include",
  }),
  tagTypes: ["WorkoutLog", "LogSet"],
  endpoints: (builder) => ({
    getWorkoutLogs: builder.query<WorkoutLog[], { memberId?: number; programId?: number; startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: "",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "WorkoutLog" as const, id })),
              { type: "WorkoutLog", id: "LIST" },
            ]
          : [{ type: "WorkoutLog", id: "LIST" }],
    }),
    
    getWorkoutLogById: builder.query<WorkoutLog, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "WorkoutLog", id }],
    }),
    
    createWorkoutLog: builder.mutation<WorkoutLog, Partial<WorkoutLog>>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "WorkoutLog", id: "LIST" }],
    }),
    
    updateWorkoutLog: builder.mutation<WorkoutLog, { id: number; data: Partial<WorkoutLog> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "WorkoutLog", id },
        { type: "WorkoutLog", id: "LIST" },
      ],
    }),
    
    deleteWorkoutLog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "WorkoutLog", id },
        { type: "WorkoutLog", id: "LIST" },
      ],
    }),
    
    addSetToLog: builder.mutation<WorkoutLogSet, Partial<WorkoutLogSet>>({
      query: (body) => ({
        url: "/sets",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "WorkoutLog", id: arg.workout_log?.id },
        { type: "LogSet", id: "LIST" },
      ],
    }),
    
    updateLogSet: builder.mutation<WorkoutLogSet, { id: number; data: Partial<WorkoutLogSet> }>({
      query: ({ id, data }) => ({
        url: `/sets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "LogSet", id: "LIST" }],
    }),
    
    deleteLogSet: builder.mutation<void, number>({
      query: (id) => ({
        url: `/sets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "LogSet", id: "LIST" }],
    }),
  }),
});

export const {
  useGetWorkoutLogsQuery,
  useGetWorkoutLogByIdQuery,
  useCreateWorkoutLogMutation,
  useUpdateWorkoutLogMutation,
  useDeleteWorkoutLogMutation,
  useAddSetToLogMutation,
  useUpdateLogSetMutation,
  useDeleteLogSetMutation,
} = workoutLogsApi;