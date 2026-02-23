import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'trainer' | 'member';
  status: 'active' | 'inactive';
  organizationId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'trainer' | 'member';
  organizationId?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
      providesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
} = authApi;
