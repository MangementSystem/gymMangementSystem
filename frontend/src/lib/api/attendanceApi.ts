import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { AttendanceDevice, AttendanceLog } from './types';

const normalizeDateRangeParams = <T extends { startDate?: string; endDate?: string }>(
  params: T,
) => {
  const normalized = { ...params } as T;

  if (normalized.startDate && normalized.startDate.length === 10) {
    normalized.startDate = `${normalized.startDate}T00:00:00` as T['startDate'];
  }

  if (normalized.endDate && normalized.endDate.length === 10) {
    normalized.endDate = `${normalized.endDate}T23:59:59.999` as T['endDate'];
  }

  return normalized;
};

export interface CreateAttendanceDeviceRequest {
  name: string;
  serial_number: string;
  ip_address?: string;
  status?: string;
  organizationId?: number;
}

export interface UpdateAttendanceDeviceRequest {
  name?: string;
  serial_number?: string;
  ip_address?: string;
  status?: string;
}

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['AttendanceLog', 'AttendanceDevice'],
  endpoints: (builder) => ({
    getAttendanceLogs: builder.query<
      AttendanceLog[],
      {
        organizationId?: number;
        memberId?: number;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params) => ({
        url: '/attendance-logs',
        params: normalizeDateRangeParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'AttendanceLog' as const, id })),
              { type: 'AttendanceLog', id: 'LIST' },
            ]
          : [{ type: 'AttendanceLog', id: 'LIST' }],
    }),
    checkIn: builder.mutation<AttendanceLog, { memberId: number; deviceId?: number }>({
      query: (body) => ({ url: '/attendance-logs/check-in', method: 'POST', body }),
      invalidatesTags: [{ type: 'AttendanceLog', id: 'LIST' }],
    }),
    checkOut: builder.mutation<AttendanceLog, { logId: number }>({
      query: ({ logId }) => ({
        url: `/attendance-logs/${logId}/check-out`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { logId }) => [
        { type: 'AttendanceLog', id: logId },
        { type: 'AttendanceLog', id: 'LIST' },
      ],
    }),
    getDevices: builder.query<AttendanceDevice[], { organizationId?: number }>({
      query: (params) => ({ url: '/attendance-devices', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'AttendanceDevice' as const,
                id,
              })),
              { type: 'AttendanceDevice', id: 'LIST' },
            ]
          : [{ type: 'AttendanceDevice', id: 'LIST' }],
    }),
    createDevice: builder.mutation<AttendanceDevice, CreateAttendanceDeviceRequest>({
      query: (body) => ({ url: '/attendance-devices', method: 'POST', body }),
      invalidatesTags: [{ type: 'AttendanceDevice', id: 'LIST' }],
    }),
    updateDevice: builder.mutation<
      AttendanceDevice,
      { id: number; data: UpdateAttendanceDeviceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/attendance-devices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AttendanceDevice', id },
        { type: 'AttendanceDevice', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAttendanceLogsQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useGetDevicesQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
} = attendanceApi;
