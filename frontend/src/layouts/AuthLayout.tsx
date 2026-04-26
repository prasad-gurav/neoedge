import { Outlet } from 'react-router-dom';
import { Brand } from '@/components/Brand';

function IconShield() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconBolt() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconLock() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.75"
            />
            <path
                d="M8 11V7a4 4 0 118 0v4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconGlobe() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
            <path
                d="M3 12h18M12 3a16 16 0 000 18M12 3a16 16 0 010 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconChevronDown() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function AuthLayout() {
  return (
      <div className="auth-split">
          <aside className="auth-hero" aria-label="About Neoedge">
              <header>
                  <Brand theme="hero" size={22} />
              </header>
              <div>
                  <h1 className="auth-hero__title">
                      <span className="auth-hero__title--primary">Banking built on</span>
                      <span className="auth-hero__title--accent">
                          trust, powered by innovation.
                      </span>
          </h1>
                  <p className="auth-hero__lead">
                      Open accounts, move money, and see every transaction on a
                      double-entry ledger — balanced, transparent, and built for the way
                      you bank today.
          </p>
                  <div className="auth-hero__features">
                      <div className="auth-hero__feature">
                          <div className="auth-hero__feature-icon" aria-hidden>
                              <IconShield />
                          </div>
                          <h3>Bank-grade security</h3>
                          <p>Your data is encrypted and always protected.</p>
                      </div>
                      <div className="auth-hero__feature">
                          <div className="auth-hero__feature-icon" aria-hidden>
                              <IconBolt />
                          </div>
                          <h3>Real-time access</h3>
                          <p>Instant updates across all your accounts.</p>
                      </div>
                      <div className="auth-hero__feature">
                          <div className="auth-hero__feature-icon" aria-hidden>
                              <IconLock />
                          </div>
                          <h3>Private &amp; secure</h3>
                          <p>We never share your personal information.</p>
                      </div>
                  </div>
        </div>
              <p className="auth-hero__foot">© 2026 Neoedge Core · All rights reserved</p>
      </aside>
          <div className="auth-main">
              <div className="auth-main__bar">
                  <button
                      type="button"
                      className="auth-lang"
                      aria-label="Language: English"
                      onClick={() => {
                          /* i18n language picker */
                      }}
                  >
                      <IconGlobe />
                      <span>English</span>
                      <IconChevronDown />
                  </button>
              </div>
              <div className="auth-main__content">
                  <div className="auth-form-wrap">
                      <Outlet />
                  </div>
              </div>
          </div>
    </div>
  );
}
