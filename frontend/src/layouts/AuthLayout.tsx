import { Outlet } from 'react-router-dom';
import { Brand } from '@/components/Brand';

export function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--color-bg)',
      }}
    >
      <aside
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px 40px',
          background: 'var(--color-primary)',
          color: '#eef0d9',
        }}
      >
        <Brand />
        <div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 3.2vw, 3rem)',
              color: '#eef0d9',
              maxWidth: 480,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            Banking built on a ledger you can actually trust.
          </h1>
          <p style={{ color: '#c9d3c1', marginTop: 18, maxWidth: 460 }}>
            Open accounts, move money between them, and see every posting on the
            double-entry ledger — balanced to the cent.
          </p>
        </div>
        <div style={{ color: '#98a89a', fontSize: '.85rem' }}>
          neoedge core · api v1
        </div>
      </aside>
      <main
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: 24,
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
