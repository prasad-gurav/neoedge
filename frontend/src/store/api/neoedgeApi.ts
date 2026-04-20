import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Account,
  AccountListResponse,
  CreateAccountRequest,
  CreateTransferRequest,
  LedgerBalanceResponse,
  LedgerEntriesResponse,
  LoginRequest,
  RegisterUserRequest,
  TransactionDetail,
  TransactionListResponse,
  TransferResult,
  User,
} from '@/types/neoedge';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000';

export const neoedgeApi = createApi({
  reducerPath: 'neoedgeApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Account', 'Transaction', 'LedgerBalance', 'LedgerEntryList'],
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, RegisterUserRequest>({
      query: (body) => ({
        url: '/api/v1/users',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<User, LoginRequest>({
      query: (body) => ({
        url: '/api/v1/users/login',
        method: 'POST',
        body,
      }),
    }),

    getUser: builder.query<User, string>({
      query: (userId) => `/api/v1/users/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
    }),

    getAccountsByUser: builder.query<AccountListResponse, string>({
      query: (userId) => `/api/v1/accounts/user/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: 'Account', id: `LIST-${userId}` },
      ],
    }),

    getAccount: builder.query<Account, string>({
      query: (accountId) => `/api/v1/accounts/${accountId}`,
      providesTags: (_result, _error, accountId) => [
        { type: 'Account', id: accountId },
      ],
    }),

    createAccount: builder.mutation<Account, CreateAccountRequest>({
      query: (body) => ({
        url: '/api/v1/accounts',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Account', id: `LIST-${arg.userId}` },
      ],
    }),

    createTransfer: builder.mutation<TransferResult, CreateTransferRequest>({
      query: (body) => ({
        url: '/api/v1/transactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Transaction', id: `ACCOUNT-${arg.fromAccountId}` },
        { type: 'Transaction', id: `ACCOUNT-${arg.toAccountId}` },
        { type: 'LedgerBalance', id: arg.fromAccountId },
        { type: 'LedgerBalance', id: arg.toAccountId },
        { type: 'LedgerEntryList', id: arg.fromAccountId },
        { type: 'LedgerEntryList', id: arg.toAccountId },
      ],
    }),

    getTransaction: builder.query<TransactionDetail, string>({
      query: (transactionId) => `/api/v1/transactions/${transactionId}`,
      providesTags: (_result, _error, transactionId) => [
        { type: 'Transaction', id: transactionId },
      ],
    }),

    getTransactionsByAccount: builder.query<
      TransactionListResponse,
      { accountId: string; limit?: number }
    >({
      query: ({ accountId, limit }) => ({
        url: `/api/v1/transactions/account/${accountId}`,
        params: limit != null ? { limit } : undefined,
      }),
      providesTags: (_result, _error, { accountId }) => [
        { type: 'Transaction', id: `ACCOUNT-${accountId}` },
      ],
    }),

    getLedgerBalance: builder.query<LedgerBalanceResponse, string>({
      query: (accountId) => `/api/v1/ledger/balance/${accountId}`,
      providesTags: (_result, _error, accountId) => [
        { type: 'LedgerBalance', id: accountId },
      ],
    }),

    getLedgerEntries: builder.query<
      LedgerEntriesResponse,
      { accountId: string; limit?: number }
    >({
      query: ({ accountId, limit }) => ({
        url: `/api/v1/ledger/entries/${accountId}`,
        params: limit != null ? { limit } : undefined,
      }),
      providesTags: (_result, _error, { accountId }) => [
        { type: 'LedgerEntryList', id: accountId },
      ],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
  useGetAccountsByUserQuery,
  useLazyGetAccountsByUserQuery,
  useGetAccountQuery,
  useLazyGetAccountQuery,
  useCreateAccountMutation,
  useCreateTransferMutation,
  useGetTransactionQuery,
  useLazyGetTransactionQuery,
  useGetTransactionsByAccountQuery,
  useLazyGetTransactionsByAccountQuery,
  useGetLedgerBalanceQuery,
  useLazyGetLedgerBalanceQuery,
  useGetLedgerEntriesQuery,
  useLazyGetLedgerEntriesQuery,
} = neoedgeApi;
