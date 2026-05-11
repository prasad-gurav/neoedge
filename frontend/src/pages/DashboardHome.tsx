import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IconClock,
  IconChevronRight,
  IconInfo,
  IllustrationBank,
  IconSend,
  IconTxIn,
  IconTxOut,
  IconWallet,
} from '@/components/icons/DashboardIcons';
import {
  useAppSelector,
  useGetAccountsByUserQuery,
  useGetLedgerBalanceQuery,
  useGetTransactionsByAccountQuery,
} from '@/store';
import { formatCurrencySymbol, formatMinor } from '@/utils/format';

function PrimaryTotalBalance({ accountId, currency, empty }: { accountId: string; currency: string; empty: boolean }) {
  const { data, isLoading } = useGetLedgerBalanceQuery(accountId, {
    skip: empty || !accountId,
  });
  if (empty) {
    return <p className="dash-stat__amount">{formatMinor(0, currency)}</p>;
  }
  const amount = isLoading ? '0' : (data?.balanceMinor ?? '0');
  return (
    <p className="dash-stat__amount">{formatMinor(amount, currency)}</p>
  );
}

type AccountLite = {
  id: string;
  currency: string;
  accountType: string;
  status: string;
};

export function DashboardHome() {
  const user = useAppSelector((s) => s.session.user);
  const userId = user?.id ?? '';

  const { data: accountsData, isLoading: accountsLoading } =
    useGetAccountsByUserQuery(userId, { skip: !userId });

  const accounts = useMemo(
    () => (accountsData?.data ?? []) as AccountLite[],
    [accountsData],
  );
  const primaryAccount = accounts[0];
  const primaryAccountId = primaryAccount?.id;

  const { data: txData } = useGetTransactionsByAccountQuery(
    { accountId: primaryAccountId ?? '', limit: 8 },
    { skip: !primaryAccountId },
  );
  const transactions = txData?.data ?? [];
  const pendingCount = transactions.filter((t) => t.status === 'CREATED').length;
  const displayCurrency = primaryAccount?.currency ?? 'INR';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <header className="dash-hero">
        <div>
          <h1>Balances</h1>
          <p>See where your money is.</p>
        </div>
        <Link
          to="/transfer"
          className="btn--dash-cta"
          style={{ textDecoration: 'none' }}
        >
          <IconSend size={18} />
          Send money
          <IconChevronRight size={16} style={{ marginLeft: 2, opacity: 0.85 }} />
        </Link>
      </header>

      <div className="dash-balance-row">
        <div className="dash-stat dash-stat--total">
          <div className="dash-stat--total__body">
            <div className="dash-stat__kicker">
              {accounts.length > 1 ? 'Primary account' : 'Total balance'}
            </div>
            <PrimaryTotalBalance
              accountId={primaryAccountId ?? ''}
              currency={displayCurrency}
              empty={!primaryAccount}
            />
            {!primaryAccount && (
              <p className="dash-stat__sub">Open an account to get started</p>
            )}
            {primaryAccount && (
              <p className="dash-stat__sub">
                {displayCurrency} · ending {primaryAccount.id.slice(-6)}
                {accounts.length > 1 && (
                  <span style={{ marginLeft: 6, opacity: 0.9 }}>
                    · {accounts.length} accounts
                  </span>
                )}
              </p>
            )}
            <div className="dash-ledger-hint">
              <span className="dash-ic-muted">
                <IconInfo size={16} />
              </span>
              <span>Calculated from the double-entry ledger</span>
            </div>
          </div>
          <div className="dash-stat--total__art" aria-hidden>
            <IllustrationBank />
          </div>
        </div>

        <div className="dash-stat dash-stat--pending">
          <div className="dash-stat--pending__top">
            <div>
              <div className="dash-stat__kicker">Pending transfers</div>
              <p className="dash-pending__num">{pendingCount}</p>
            </div>
            <div className="dash-pending-art">
              <IconClock size={48} />
            </div>
          </div>
          <p className="dash-pending__note">
            Last {Math.min(transactions.length, 8)} on primary account
          </p>
        </div>
      </div>

      <section>
        <div className="dash-section-head">
          <h2>Your accounts</h2>
          <Link to="/accounts" className="dash-link-more">
            Manage accounts
            <span aria-hidden> &gt;</span>
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
              Open one
            </Link>
          </div>
        )}

        <div className="dash-accounts">
          {accounts.map((a) => (
            <AccountRow
              key={a.id}
              accountId={a.id}
              accountType={a.accountType}
              currency={a.currency}
              status={a.status}
            />
          ))}
        </div>
      </section>

      <section id="transactions">
        <div className="dash-section-head">
          <h2>Transactions</h2>
          {primaryAccountId && (
            <Link to="/dashboard#transactions" className="dash-link-more">
              View all
            </Link>
          )}
        </div>
        <div className="dash-tx">
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
              <div key={t.id} className="dash-tx__row">
                <div className="dash-tx__ic">
                  {outgoing ? <IconTxOut size={20} /> : <IconTxIn size={20} />}
                </div>
                <div className="dash-tx__text">
                  <div className="dash-tx__title">
                    {outgoing ? 'Sent to' : 'Received from'}{' '}
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      ending {outgoing ? t.toAccountId.slice(-6) : t.fromAccountId.slice(-6)}
                    </span>
                  </div>
                  <div className="dash-tx__meta">
                    {t.status}
                    {t.createdAt
                      ? ` · ${new Date(t.createdAt).toLocaleString()}`
                      : ''}
                  </div>
                </div>
                <div
                  className="dash-tx__amount"
                  style={{ color: outgoing ? '#5c2e2b' : 'var(--color-text)' }}
                >
                  {outgoing ? '-' : '+'}
                  {formatMinor(t.amountMinor, t.currency)}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AccountRow({
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
  const { data, isLoading } = useGetLedgerBalanceQuery(accountId, {
    skip: !accountId,
  });
  return (
    <Link to="/accounts" className="dash-account-pill">
      <div className="dash-account-pill__icon">
        <IconWallet size={20} />
      </div>
      <div className="dash-account-pill__mid">
        <div className="dash-account-pill__line1">
          <span className="dash-account-pill__name">
            {accountType === 'SAVINGS' ? 'Savings' : 'Checking'}
          </span>
          <span
            className={
              status === 'ACTIVE' ? 'dash-badge' : 'dash-badge dash-badge--frozen'
            }
          >
            {status}
          </span>
        </div>
        <div className="dash-account-pill__bal">
          {isLoading
            ? '…'
            : data
              ? formatMinor(data.balanceMinor, currency)
              : `${formatCurrencySymbol(currency)}0.00`}
        </div>
        <div
          className="dash-stat__sub"
          style={{ marginTop: 2, fontSize: '0.82rem' }}
        >
          {currency} · ending {accountId.slice(-6)}
        </div>
      </div>
      <div className="dash-account-pill__end">
        <IconChevronRight size={18} />
      </div>
    </Link>
  );
}
