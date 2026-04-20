export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export type User = {
  id: string;
  email: string;
  fullName: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterUserRequest = {
  email: string;
  password: string;
  fullName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
export type AccountType = 'CHECKING' | 'SAVINGS';

export type Account = {
  id: string;
  userId: string;
  currency: string;
  accountType: AccountType;
  status: AccountStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type AccountListResponse = {
  data: Array<{
    id: string;
    userId: string;
    currency: string;
    accountType: AccountType;
    status: AccountStatus;
    createdAt?: string;
  }>;
};

export type CreateAccountRequest = {
  userId: string;
  currency: string;
  accountType?: AccountType;
};

export type TransactionStatus = 'CREATED' | 'POSTED' | 'FAILED';

export type TransferResult = {
  id: string;
  status: TransactionStatus;
  failureReason?: string;
  journalId: string | null;
  replayed: boolean;
};

export type CreateTransferRequest = {
  fromAccountId: string;
  toAccountId: string;
  amountMinor: number | string;
  currency: string;
  idempotencyKey: string;
};

export type TransactionDetail = {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amountMinor: string;
  currency: string;
  status: TransactionStatus;
  failureReason?: string;
  journalId: string | null;
  idempotencyKey: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TransactionListResponse = {
  data: Array<{
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amountMinor: string;
    currency: string;
    status: TransactionStatus;
    createdAt?: string;
  }>;
};

export type LedgerBalanceResponse = {
  accountId: string;
  currency: string;
  balanceMinor: string;
};

export type LedgerEntryRow = {
  id: string;
  journalId: string;
  accountId: string;
  amountMinor: string;
  currency: string;
  transactionId: string | null;
  narrative: string;
  createdAt?: string;
};

export type LedgerEntriesResponse = {
  data: LedgerEntryRow[];
};
