import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useAppSelector,
  useGetAccountsByUserQuery,
  useGetLedgerBalanceQuery,
  useGetTransactionsByAccountQuery,
} from '@/store';
import { formatCurrencySymbol, formatMinor } from '@/utils/format';

export function DashboardHome() {
  const user = useAppSelector((s) => s.session.user);
  const userId = user?.id ?? '';

  const { data: accountsData, isLoading: accountsLoading } =
    useGetAccountsByUserQuery(userId, { skip: !userId });

  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData]);
  const primaryAccountId = accounts[0]?.id;

  const { data: txData } = useGetTransactionsByAccountQuery(
    { accountId: primaryAccountId ?? '', limit: 8 },
    { skip: !primaryAccountId }
  );
  const transactions = txData?.data ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>Balances</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
            See where your money is.
          </p>
        </div>
        <Link to="/transfer" className="btn accent" style={{ height: 40 }}>
          Send money →
        </Link>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 18,
        }}
      >
        <div className="card" style={{ padding: 22 }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '.9rem' }}>
            Total balance across accounts
          </div>
          <TotalBalances accounts={accounts} />
          <div
            style={{
              marginTop: 10,
              color: 'var(--color-text-muted)',
              fontSize: '.85rem',
            }}
          >
            Calculated from the double-entry ledger
          </div>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '.9rem' }}>
            Pending transfers
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: 6 }}>
            {transactions.filter((t) => t.status === 'CREATED').length}
          </div>
          <div
            style={{
              marginTop: 8,
              color: 'var(--color-text-muted)',
              fontSize: '.85rem',
            }}
          >
            Last {transactions.length} on primary account
          </div>
        </div>
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: '1.05rem' }}>Your accounts</h2>
          <Link
            to="/accounts"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '.9rem',
            }}
          >
            Manage →
          </Link>
        </div>

        {accountsLoading && (
          <div className="card" style={{ padding: 18 }}>
            Loading accounts…
          </div>
        )}

        {!accountsLoading && accounts.length === 0 && (
          <div className="card" style={{ padding: 18 }}>
            You don’t have any accounts yet.{' '}
            <Link to="/accounts" style={{ fontWeight: 600 }}>
              Open one →
            </Link>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
          }}
        >
          {accounts.map((a) => (
            <AccountCard
              key={a.id}
              accountId={a.id}
              accountType={a.accountType}
              currency={a.currency}
              status={a.status}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.05rem', marginBottom: 12 }}>Transactions</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {transactions.length === 0 && (
            <div style={{ padding: 18, color: 'var(--color-text-muted)' }}>
              {primaryAccountId
                ? 'No transactions yet on your primary account.'
                : 'Open an account to start seeing activity.'}
            </div>
          )}
          {transactions.map((t) => {
            const outgoing = t.fromAccountId === primaryAccountId;
            return (
              <div
                key={t.id}
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
                    {outgoing ? 'Sent to' : 'Received from'}{' '}
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      ending{' '}
                      {outgoing
                        ? t.toAccountId.slice(-6)
                        : t.fromAccountId.slice(-6)}
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: '.85rem',
                    }}
                  >
                    {t.status} ·{' '}
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleString()
                      : '—'}
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>
                  {outgoing ? '-' : '+'}
                  {formatMinor(t.amountMinor, t.currency)}
                </div>
                <div
                  style={{
                    fontSize: '.78rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {t.currency}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

type AccountLite = {
  id: string;
  currency: string;
  accountType: string;
  status: string;
};

function TotalBalances({ accounts }: { accounts: AccountLite[] }) {
  if (accounts.length === 0) {
    return (
      <div style={{ fontSize: '2.4rem', fontWeight: 700, marginTop: 6 }}>
        $0.00
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginTop: 6,
      }}
    >
      {accounts.map((a) => (
        <PerAccountBalance key={a.id} accountId={a.id} currency={a.currency} />
      ))}
    </div>
  );
}

function PerAccountBalance({
  accountId,
  currency,
}: {
  accountId: string;
  currency: string;
}) {
  const { data } = useGetLedgerBalanceQuery(accountId, { skip: !accountId });
  const amount = data?.balanceMinor ?? '0';
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
        {formatMinor(amount, currency)}
      </div>
      <div style={{ color: 'var(--color-text-muted)', fontSize: '.85rem' }}>
        {currency} · ending {accountId.slice(-6)}
      </div>
    </div>
  );
}

function AccountCard({
  accountId,
  accountType,
  currency,
  status,
}: {
  accountId: string;
  accountType: string;
  currency: string;
  status: string;
}) {
  const { data } = useGetLedgerBalanceQuery(accountId, { skip: !accountId });
  return (
    <Link
      to="/accounts"
      className="card"
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 600 }}>
          {accountType === 'SAVINGS' ? 'Savings' : 'Checking'}
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
      <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
        {data
          ? formatMinor(data.balanceMinor, currency)
          : `${formatCurrencySymbol(currency)}0.00`}
      </div>
      <div style={{ color: 'var(--color-text-muted)', fontSize: '.8rem' }}>
        {currency} · ending {accountId.slice(-6)}
      </div>
    </Link>
  );
}
