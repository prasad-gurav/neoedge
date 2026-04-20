import { useMemo, useState, type FormEvent } from 'react';
import {
  useAppSelector,
  useCreateTransferMutation,
  useGetAccountsByUserQuery,
} from '@/store';
import { randomIdempotencyKey } from '@/utils/format';

export function TransferPage() {
  const user = useAppSelector((s) => s.session.user);
  const userId = user?.id ?? '';
  const { data: accountsData } = useGetAccountsByUserQuery(userId, {
    skip: !userId,
  });
  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData]);

  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amountMajor, setAmountMajor] = useState('');
  const [createTransfer, { isLoading, error, data: result }] =
    useCreateTransferMutation();

  const fromAccount = accounts.find((a) => a.id === fromAccountId);
  const currency = fromAccount?.currency ?? 'USD';

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId) return;
    const cleaned = amountMajor.trim();
    if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return;
    const [whole, frac = ''] = cleaned.split('.');
    const minor = `${whole}${(frac + '00').slice(0, 2)}`;
    try {
      await createTransfer({
        fromAccountId,
        toAccountId,
        amountMinor: minor,
        currency,
        idempotencyKey: randomIdempotencyKey(),
      }).unwrap();
      setAmountMajor('');
    } catch {
      // handled via `error`
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header>
        <h1 style={{ fontSize: '1.6rem' }}>Send money</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
          Transfer between accounts — every posting hits the ledger.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="card"
        style={{ padding: 22, maxWidth: 520 }}
      >
        {error && (
          <div className="alert">
            {'data' in error && (error.data as { error?: string })?.error
              ? (error.data as { error: string }).error
              : 'Transfer failed'}
          </div>
        )}
        {result && result.status === 'POSTED' && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(46,125,79,.12)',
              color: 'var(--color-success)',
              marginBottom: 12,
              fontSize: '.9rem',
            }}
          >
            Transfer posted · journal {result.journalId?.slice(-6) ?? '—'}
            {result.replayed ? ' (replayed)' : ''}
          </div>
        )}
        {result && result.status === 'FAILED' && (
          <div className="alert">
            Transfer failed: {result.failureReason ?? 'Unknown reason'}
          </div>
        )}

        <div className="field">
          <label htmlFor="from">From account</label>
          <select
            id="from"
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            required
          >
            <option value="">Select an account…</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountType === 'SAVINGS' ? 'Savings' : 'Checking'} ·{' '}
                {a.currency} · ending {a.id.slice(-6)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="to">To account</label>
          <input
            id="to"
            placeholder="Recipient account id"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="amount">Amount ({currency})</label>
          <input
            id="amount"
            inputMode="decimal"
            placeholder="0.00"
            value={amountMajor}
            onChange={(e) => setAmountMajor(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{ width: '100%', marginTop: 4 }}
          disabled={isLoading || accounts.length === 0}
        >
          {isLoading ? 'Sending…' : 'Send transfer'}
        </button>
      </form>
    </div>
  );
}
