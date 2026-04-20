import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation, useAppDispatch, setUser } from '@/store';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading, error }] = useRegisterUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await register({ fullName, email, password }).unwrap();
      dispatch(setUser(user));
      navigate('/dashboard', { replace: true });
    } catch {
      // handled via `error`
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>Create account</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
        Start banking with neoedge in under a minute.
      </p>

      {error && (
        <div className="alert">
          {'data' in error && (error.data as { error?: string })?.error
            ? (error.data as { error: string }).error
            : 'Could not create account'}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
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
            minLength={8}
            autoComplete="new-password"
            required
          />
          <span
            style={{ fontSize: '.78rem', color: 'var(--color-text-muted)' }}
          >
            At least 8 characters.
          </span>
        </div>
        <button
          type="submit"
          className="btn"
          style={{ width: '100%', marginTop: 6 }}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p style={{ marginTop: 18, color: 'var(--color-text-muted)' }}>
        Already have an account?{' '}
        <Link
          to="/login"
          style={{ color: 'var(--color-primary)', fontWeight: 600 }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
