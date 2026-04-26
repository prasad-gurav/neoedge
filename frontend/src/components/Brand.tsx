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
  const markSize = size + 6;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src="/favicon.svg"
        width={markSize}
        height={markSize}
        alt=""
        aria-hidden
        style={{ display: 'block', flexShrink: 0, borderRadius: '22%' }}
      />
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
