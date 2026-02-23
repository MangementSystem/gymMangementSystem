import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from './baseQuery';
import type { Transaction } from './types';

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

export interface CreateTransactionRequest {
  organizationId: number;
  membershipId?: number;
  memberId?: number;
  type: string;
  category: string;
  description?: string;
  amount: number;
  currency?: string;
  payment_method?: string;
  status?: string;
}

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: createApiBaseQuery('/transactions'),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    getTransactions: builder.query<
      Transaction[],
      {
        organizationId?: number;
        memberId?: number;
        type?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params) => ({ url: '', params: normalizeDateRangeParams(params) }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Transaction' as const, id })),
              { type: 'Transaction', id: 'LIST' },
            ]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),
    createTransaction: builder.mutation<Transaction, CreateTransactionRequest>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }],
    }),
    getFinancialReport: builder.query<
      {
        totalRevenue: number;
        totalExpenses: number;
        netIncome: number;
        transactionCount: number;
      },
      { organizationId: number; startDate: string; endDate: string }
    >({
      query: (params) => ({
        url: '/reports/financial',
        params: normalizeDateRangeParams(params),
      }),
    }),
  }),
});

export const { useGetTransactionsQuery, useCreateTransactionMutation, useGetFinancialReportQuery } =
  transactionsApi;
