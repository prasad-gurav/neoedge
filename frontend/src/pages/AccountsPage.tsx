import { useState, type FormEvent } from 'react';
import {
  useAppSelector,
  useCreateAccountMutation,
  useGetAccountsByUserQuery,
  useGetLedgerBalanceQuery,
} from '@/store';
import type { AccountType } from '@/types/neoedge';
import { formatCurrencySymbol, formatMinor } from '@/utils/format';

export function AccountsPage() {
  const user = useAppSelector((s) => s.session.user);
  const userId = user?.id ?? '';
  const { data, isLoading } = useGetAccountsByUserQuery(userId, {
    skip: !userId,
  });
  const [createAccount, { isLoading: creating, error }] =
    useCreateAccountMutation();
  const [currency, setCurrency] = useState('USD');
  const [accountType, setAccountType] = useState<AccountType>('CHECKING');

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await createAccount({ userId, currency, accountType }).unwrap();
    } catch {
      // handled via `error`
    }
  };

  const accounts = data?.data ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header>
        <h1 style={{ fontSize: '1.6rem' }}>Accounts</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
          Open a new account or view your existing ones.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 18,
          alignItems: 'start',
        }}
      >
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {isLoading && (
            <div style={{ padding: 18 }}>Loading accounts…</div>
          )}
          {!isLoading && accounts.length === 0 && (
            <div style={{ padding: 18, color: 'var(--color-text-muted)' }}>
              No accounts yet. Open one →
            </div>
          )}
          {accounts.map((a) => (
            <AccountRow
              key={a.id}
              accountId={a.id}
              accountType={a.accountType}
              currency={a.currency}
              status={a.status}
              createdAt={a.createdAt}
            />
          ))}
        </div>

        <form onSubmit={onCreate} className="card" style={{ padding: 18 }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 12 }}>
            Open new account
          </h2>
          {error && (
            <div className="alert">
              {'data' in error && (error.data as { error?: string })?.error
                ? (error.data as { error: string }).error
                : 'Could not create account'}
            </div>
          )}
          <div className="field">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountType)}
            >
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
            </select>
          </div>
          <button type="submit" className="btn" disabled={creating}>
            {creating ? 'Opening…' : 'Open account'}
          </button>
        </form>
      </section>
    </div>
  );
}

function AccountRow({
  accountId,
  accountType,
  currency,
  status,
  createdAt,
}: {
  accountId: string;
  accountType: string;
  currency: string;
  status: string;
  createdAt?: string;
}) {
  const { data } = useGetLedgerBalanceQuery(accountId, { skip: !accountId });
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>
          {accountType === 'SAVINGS' ? 'Savings' : 'Checking'}{' '}
          <span
            style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}
          >
            · {currency} · ending {accountId.slice(-6)}
          </span>
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '.85rem' }}>
          {createdAt ? `Opened ${new Date(createdAt).toLocaleDateString()}` : ''}
        </div>
      </div>
      <div style={{ fontWeight: 700 }}>
        {data
          ? formatMinor(data.balanceMinor, currency)
          : `${formatCurrencySymbol(currency)}0.00`}
      </div>
      <span
        style={{
          fontSize: '.72rem',
          padding: '3px 8px',
          borderRadius: 999,
          background:
            status === 'ACTIVE' ? 'rgba(46,125,79,.12)' : 'rgba(0,0,0,.06)',
          color:
            status === 'ACTIVE'
              ? 'var(--color-success)'
              : 'var(--color-text-muted)',
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    </div>
  );
}
