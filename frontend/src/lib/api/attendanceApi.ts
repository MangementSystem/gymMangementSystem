// store/api/attendanceApi.ts
import { createApi as createApi3, fetchBaseQuery as fetchBaseQuery3 } from "@reduxjs/toolkit/query/react";
import type { AttendanceLog } from "../../../../backend/src/attendance-logs/entities/attendance-log.entity";
import type { AttendanceDevice } from "../../../../backend/src/attendance-devices/entities/attendance-device.entity";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const attendanceApi = createApi3({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery3({ baseUrl: `${baseUrl}/attendance`, credentials: "include" }),
  tagTypes: ["AttendanceLog", "AttendanceDevice"],
  endpoints: (builder) => ({
    getAttendanceLogs: builder.query<AttendanceLog[], { memberId?: number; startDate?: string; endDate?: string }>({
      query: (params) => ({ url: "/logs", params }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "AttendanceLog" as const, id })), { type: "AttendanceLog", id: "LIST" }] : [{ type: "AttendanceLog", id: "LIST" }],
    }),
    checkIn: builder.mutation<AttendanceLog, { memberId: number; deviceId: number }>({
      query: (body) => ({ url: "/logs/check-in", method: "POST", body }),
      invalidatesTags: [{ type: "AttendanceLog", id: "LIST" }],
    }),
    checkOut: builder.mutation<AttendanceLog, { logId: number }>({
      query: ({ logId }) => ({ url: `/logs/${logId}/check-out`, method: "POST" }),
      invalidatesTags: (result, error, { logId }) => [{ type: "AttendanceLog", id: logId }, { type: "AttendanceLog", id: "LIST" }],
    }),
    getDevices: builder.query<AttendanceDevice[], { organizationId?: number }>({
      query: (params) => ({ url: "/devices", params }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "AttendanceDevice" as const, id })), { type: "AttendanceDevice", id: "LIST" }] : [{ type: "AttendanceDevice", id: "LIST" }],
    }),
    createDevice: builder.mutation<AttendanceDevice, Partial<AttendanceDevice>>({
      query: (body) => ({ url: "/devices", method: "POST", body }),
      invalidatesTags: [{ type: "AttendanceDevice", id: "LIST" }],
    }),
  }),
});

export const { useGetAttendanceLogsQuery, useCheckInMutation, useCheckOutMutation, useGetDevicesQuery, useCreateDeviceMutation } = attendanceApi;