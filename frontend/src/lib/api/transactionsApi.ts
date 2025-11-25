
// store/api/transactionsApi.ts
import { createApi as createApi6, fetchBaseQuery as fetchBaseQuery6 } from "@reduxjs/toolkit/query/react";
import type { Transaction } from "../../../../backend/src/transactions/entities/transaction.entity";


const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const transactionsApi = createApi6({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery6({ baseUrl: `${baseUrl}/transactions`, credentials: "include" }),
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], { organizationId?: number; memberId?: number; type?: string; startDate?: string; endDate?: string }>({
      query: (params) => ({ url: "", params }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Transaction" as const, id })), { type: "Transaction", id: "LIST" }] : [{ type: "Transaction", id: "LIST" }],
    }),
    createTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: [{ type: "Transaction", id: "LIST" }],
    }),
    getFinancialReport: builder.query<any, { organizationId: number; startDate: string; endDate: string }>({
      query: (params) => ({ url: "/reports/financial", params }),
    }),
  }),
});

export const { useGetTransactionsQuery, useCreateTransactionMutation, useGetFinancialReportQuery } = transactionsApi;