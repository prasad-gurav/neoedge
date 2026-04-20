import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, useAppDispatch, setUser } from '@/store';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await login({ email, password }).unwrap();
      dispatch(setUser(user));
      navigate('/dashboard', { replace: true });
    } catch {
      // handled via `error`
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>Welcome back</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
        Sign in to your neoedge account.
      </p>

      {error && (
        <div className="alert">
          {'data' in error && (error.data as { error?: string })?.error
            ? (error.data as { error: string }).error
            : 'Invalid credentials'}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          className="btn"
          style={{ width: '100%', marginTop: 6 }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p style={{ marginTop: 18, color: 'var(--color-text-muted)' }}>
        New here?{' '}
        <Link
          to="/signup"
          style={{ color: 'var(--color-primary)', fontWeight: 600 }}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
