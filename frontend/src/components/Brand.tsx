const neoedgeTextStyle = (size: number, color: string) => ({
  fontWeight: 800 as const,
  letterSpacing: '-0.02em' as const,
  fontSize: size,
  color,
  textTransform: 'lowercase' as const,
});

type BrandTheme = 'default' | 'hero';

export function Brand({
  size = 22,
  theme = 'default',
}: {
  size?: number;
  theme?: BrandTheme;
}) {
  const isHero = theme === 'hero';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size + 6,
          height: size + 6,
          borderRadius: 8,
          background: isHero ? 'var(--color-lime)' : 'var(--color-primary)',
          display: 'grid',
          placeItems: 'center',
          color: isHero ? 'var(--color-primary)' : 'var(--color-accent)',
          fontWeight: 800,
          fontSize: size - 6,
        }}
      >
        N
      </div>
      <span
        style={neoedgeTextStyle(
          size,
          isHero ? '#ffffff' : 'var(--color-primary)',
        )}
      >
        neoedge
      </span>
    </div>
  );
}
