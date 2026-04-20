export function Brand({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size + 6,
          height: size + 6,
          borderRadius: 8,
          background: 'var(--color-primary)',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--color-accent)',
          fontWeight: 800,
          fontSize: size - 6,
        }}
      >
        N
      </div>
      <span
        style={{
          fontWeight: 800,
          letterSpacing: '-0.02em',
          fontSize: size,
          color: 'var(--color-primary)',
        }}
      >
        neoedge
      </span>
    </div>
  );
}
