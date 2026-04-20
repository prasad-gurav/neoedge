import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Brand } from '@/components/Brand';
import { logout, useAppDispatch, useAppSelector } from '@/store';

const primaryLinks = [
  { to: '/dashboard', label: 'Home', icon: '⌂' },
  { to: '/accounts', label: 'Accounts', icon: '◉' },
  { to: '/transfer', label: 'Transfers', icon: '↗' },
];

const plannedLinks = [
  { label: 'Cards', icon: '▭' },
  { label: 'Explore', icon: '✦' },
  { label: 'History', icon: '◷' },
];

export function DashboardLayout() {
  const user = useAppSelector((s) => s.session.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        minHeight: '100vh',
        background: 'var(--color-bg)',
      }}
    >
      <aside
        style={{
          padding: '22px 18px',
          borderRight: '1px solid var(--color-border)',
          background: 'var(--color-surface-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ padding: '4px 8px' }}>
          <Brand size={20} />
        </div>

        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            padding: '10px 12px',
            color: 'var(--color-text-muted)',
            fontSize: '.9rem',
          }}
        >
          Search…
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {primaryLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: '.95rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                background: isActive ? '#fff' : 'transparent',
                border: isActive
                  ? '1px solid var(--color-border)'
                  : '1px solid transparent',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              })}
            >
              <span style={{ width: 18, textAlign: 'center' }}>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
          {plannedLinks.map((l) => (
            <div
              key={l.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: '.95rem',
                color: 'var(--color-text-muted)',
                opacity: 0.7,
              }}
              title="Coming soon"
            >
              <span style={{ width: 18, textAlign: 'center' }}>{l.icon}</span>
              {l.label}
            </div>
          ))}
        </nav>

        <div
          style={{
            marginTop: 8,
            padding: '0 10px',
            color: 'var(--color-text-muted)',
            fontSize: '.75rem',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
          }}
        >
          Actions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <NavLink
            to="/accounts"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              color: 'var(--color-text)',
              fontSize: '.95rem',
            }}
          >
            <span style={{ width: 18, textAlign: 'center' }}>⬇</span>
            Open account
          </NavLink>
          <NavLink
            to="/transfer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              color: 'var(--color-text)',
              fontSize: '.95rem',
            }}
          >
            <span style={{ width: 18, textAlign: 'center' }}>⬆</span>
            Send money
          </NavLink>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontSize: '.9rem', fontWeight: 600 }}>
              {user?.fullName ?? 'Guest'}
            </div>
            <div style={{ fontSize: '.78rem', color: 'var(--color-text-muted)' }}>
              {user?.email ?? ''}
            </div>
            <button
              onClick={onLogout}
              className="btn secondary"
              style={{ marginTop: 10, height: 36, width: '100%' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main
        style={{
          padding: '28px clamp(18px, 4vw, 40px)',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
