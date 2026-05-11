import { useCallback, useEffect, useId, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Brand } from '@/components/Brand';
import {
  IconAccounts,
  IconCard,
  IconClose,
  IconCompass,
  IconHistory,
  IconHome,
  IconMenu,
  IconPlus,
  IconSearch,
  IconSend,
  IconTransfer,
} from '@/components/icons/DashboardIcons';
import { logout, useAppDispatch, useAppSelector } from '@/store';

const DASHBOARD_NAV_BREAKPOINT = 1024;

function initialsFromName(name: string | undefined) {
  const s = (name ?? '').trim();
  if (!s) return 'U';
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const primaryLinks: {
  to: string;
  label: string;
  Icon: typeof IconHome;
}[] = [
  { to: '/dashboard', label: 'Home', Icon: IconHome },
  { to: '/accounts', label: 'Accounts', Icon: IconAccounts },
  { to: '/transfer', label: 'Transfers', Icon: IconTransfer },
];

const plannedLinks: { label: string; Icon: typeof IconCard }[] = [
  { label: 'Cards', Icon: IconCard },
  { label: 'Explore', Icon: IconCompass },
  { label: 'History', Icon: IconHistory },
];

function useNarrowNav() {
  const [narrow, setNarrow] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.innerWidth < DASHBOARD_NAV_BREAKPOINT,
  );
  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${DASHBOARD_NAV_BREAKPOINT - 1}px)`,
    );
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

export function DashboardLayout() {
  const user = useAppSelector((s) => s.session.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const navId = useId();
  const narrowNav = useNarrowNav();
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = useCallback(() => setNavOpen(false), []);
  const openNav = useCallback(() => setNavOpen(true), []);

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${DASHBOARD_NAV_BREAKPOINT}px)`,
    );
    const onVw = () => {
      if (mq.matches) setNavOpen(false);
    };
    onVw();
    mq.addEventListener('change', onVw);
    return () => mq.removeEventListener('change', onVw);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setNavOpen(false);
    });
  }, [location.pathname, location.key]);

  useEffect(() => {
    if (!navOpen || !narrowNav) {
      document.body.style.removeProperty('overflow');
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navOpen, narrowNav]);

  const onLogout = () => {
    closeNav();
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-app dashboard-app__layout">
      {narrowNav && (
        <header className="dashboard-app__topbar">
          <button
            type="button"
            className="dashboard-app__menu-btn"
            onClick={openNav}
            aria-expanded={navOpen}
            aria-controls={navId}
            aria-label="Open menu"
          >
            <IconMenu size={22} />
          </button>
          <div className="dashboard-app__topbar-brand">
            <Brand size={18} />
          </div>
        </header>
      )}

      {narrowNav && (
        <button
          type="button"
          className={
            'dashboard-app__scrim' + (navOpen ? ' is-visible' : '')
          }
          onClick={closeNav}
          aria-label="Close menu"
          tabIndex={navOpen ? 0 : -1}
        />
      )}

      <aside
        id={navId}
        className={'dashboard-app__sidebar' + (navOpen && narrowNav ? ' is-open' : '')}
        aria-label="Navigation"
        aria-hidden={narrowNav && !navOpen ? true : undefined}
        inert={narrowNav && !navOpen ? (true as unknown as boolean) : undefined}
      >
        <div className="dashboard-app__brand-row">
          <div
            className="dashboard-app__brand-wrap"
            style={{ padding: '2px 0' }}
          >
            <Brand size={20} />
          </div>
          {narrowNav && (
            <button
              type="button"
              className="dashboard-app__close-btn"
              onClick={closeNav}
              aria-label="Close menu"
            >
              <IconClose size={22} />
            </button>
          )}
        </div>

        <div className="dashboard-app__search" role="search">
          <span className="dashboard-app__nav-ic" style={{ opacity: 0.5 }}>
            <IconSearch size={18} />
          </span>
          <span>Search…</span>
          <kbd className="dashboard-app__search-kbd">⌘K</kbd>
        </div>

        <nav
          className="dashboard-app__nav"
          aria-label="Main"
          onClick={narrowNav ? closeNav : undefined}
        >
          {primaryLinks.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end={to === '/dashboard'}>
              <span className="dashboard-app__nav-ic">
                <Icon size={20} />
              </span>
              {label}
            </NavLink>
          ))}
          {plannedLinks.map(({ label, Icon }) => (
            <div
              key={label}
              className="dashboard-app__nav-pill"
              title="Coming soon"
            >
              <span className="dashboard-app__nav-ic">
                <Icon size={20} />
              </span>
              {label}
            </div>
          ))}
        </nav>

        <div className="dashboard-app__actions-label">Actions</div>
        <div className="dashboard-app__actions" onClick={narrowNav ? closeNav : undefined}>
          <NavLink to="/accounts">
            <span
              className="dashboard-app__nav-ic"
              style={{ color: 'var(--dash-primary)' }}
            >
              <IconPlus size={18} />
            </span>
            Open account
          </NavLink>
          <NavLink to="/transfer">
            <span
              className="dashboard-app__nav-ic"
              style={{ color: 'var(--dash-primary)' }}
            >
              <IconSend size={18} />
            </span>
            Send money
          </NavLink>
        </div>

        <div className="dashboard-app__user">
          <div className="dashboard-app__user-row">
            <div className="dashboard-app__avatar" aria-hidden>
              {initialsFromName(user?.fullName)}
            </div>
            <div className="dashboard-app__user-meta">
              <div className="dashboard-app__user-name">
                {user?.fullName ?? 'Guest'}
              </div>
              <div className="dashboard-app__user-email">
                {user?.email ?? ''}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="dashboard-app__signout"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="dashboard-app__main">
        <Outlet />
      </main>
    </div>
  );
}
