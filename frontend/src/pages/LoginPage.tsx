import { useId, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, useAppDispatch, setUser } from '@/store';

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 7l8.1 5.4a2 2 0 001.8 0L21 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 11V7a4 4 0 118 0v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.5 10.5a2 2 0 102.7 2.7M6.3 6.3C3.4 7.6 1.4 9.6 1 12c1.2 6 5.1 9 11 9 2.2 0 4.1-.4 5.6-1.1M9.9 4.2A11 11 0 0112 4c5.5 0 8.3 2.1 9.5 4.2a10 10 0 01.5.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-6 11-6 11 6 11 6-4 6-11 6S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l1.5 1.5L15 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginPage() {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <h1 className="auth-form__title">Welcome back</h1>
      <p className="auth-form__subtitle">Sign in to your Neoedge account</p>

      {error && (
        <div className="alert" role="alert">
          {'data' in error && (error.data as { error?: string })?.error
            ? (error.data as { error: string }).error
            : 'Invalid credentials'}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <div>
          <label className="auth-field__label" htmlFor={emailId}>
            Email
          </label>
          <div className="auth-input">
            <span className="auth-input__icon" aria-hidden>
              <MailIcon />
            </span>
            <input
              className="auth-input__field"
              id={emailId}
              type="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>
        <div>
          <label className="auth-field__label" htmlFor={passwordId}>
            Password
          </label>
          <div className="auth-input auth-input--password">
            <span className="auth-input__icon" aria-hidden>
              <LockIcon />
            </span>
            <input
              className="auth-input__field"
              id={passwordId}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-input__toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="auth-row">
          <label className="auth-remember">
            <input type="checkbox" name="remember" />
            Remember me
          </label>
          <button
            type="button"
            className="auth-link"
            onClick={() => {
              /* Forgot password: add route or reset flow when available */
            }}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="btn-auth-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
          <ChevronRightIcon />
        </button>
      </form>

      <div className="auth-divider" role="separator">
        or
      </div>

      <button
        type="button"
        className="btn-auth-secondary"
        onClick={() => {
          /* WebAuthn / passkey sign-in */
        }}
      >
        <ShieldCheckIcon />
        Sign in with passkey
      </button>

      <p className="auth-form__footer" style={{ marginTop: 20 }}>
        New here?{' '}
        <Link to="/signup" className="auth-link">
          Create an account
        </Link>
      </p>
    </div>
  );
}
