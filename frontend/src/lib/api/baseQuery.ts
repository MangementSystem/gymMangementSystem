import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const createApiBaseQuery = (
  resourcePath = '',
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${apiBaseUrl}${resourcePath}`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (typeof window !== 'undefined' && result.error && result.error.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentOrganization');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return result;
  };
};

export { apiBaseUrl };
