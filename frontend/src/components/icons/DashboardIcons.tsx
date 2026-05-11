type IconProps = { className?: string; size?: number };

export function IconMenu({ className, size = 24 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 7h16M4 12h16M4 17h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconClose({ className, size = 22 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
} as const);

export function IconSearch({ className, size = 18 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <circle
        cx="10.5"
        cy="10.5"
        r="5.75"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M15 15l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function IconHome({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <path
        d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4v-9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconAccounts({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <circle
        cx="12"
        cy="9"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M6.5 19c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function IconTransfer({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <path
        d="M7 7h11M16 4l3 3-3 3M17 17H6M8 20l-3-3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function IconCard({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconCompass({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="m12 8 1.2 3.2L16 12l-2.8.8L12 16l-1.2-3.2L8 12l2.8-.8L12 8Z"
        fill="currentColor"
        opacity=".9"
      />
    </svg>
  );
}

export function IconHistory({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 8v4.2l2.5 1.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function IconPlus({ className, size = 18 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <path
        d="M12 5.5v13M5.5 12h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSend({ className, size = 18 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <path
        d="M4.5 19.5 21 12 4.5 4.5l1.3 5.2L12 12l-6.2 1.2-1.3 6.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconChevronRight({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <path
        d="M9.5 6.5 14.5 12l-5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function IconInfo({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path
        d="M12 10.2V16M12 7.2h.01"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconClock({ className, size = 48 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="24"
        cy="24"
        r="16"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.28"
      />
      <path
        d="M24 16v8.2l4.2 2.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

export function IconWallet({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...base(size)}>
      <path
        d="M4 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1H4V7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <rect
        x="3"
        y="6"
        width="14"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="14" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

const txBase = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 20 20',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
} as const);

export function IconTxOut({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...txBase(size)} style={{ color: '#c45c54' }}>
      <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.12" />
      <path
        d="M10 4.5v7M6.2 6.2 10 4.5l3.8 1.7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  );
}

export function IconTxIn({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} aria-hidden {...txBase(size)} style={{ color: 'var(--dash-ok, #2e6b4a)' }}>
      <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.12" />
      <path
        d="M10 5.5v7M6.2 12.2 10 15.5l3.8-1.7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  );
}

export function IllustrationBank() {
  return (
    <svg
      width="120"
      height="88"
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M60 8 12 32v4h96v-4L60 8Z"
        fill="var(--dash-lime-muted, #d8f08a)"
        opacity="0.85"
      />
      <path d="M12 80h96v6H12v-6Z" fill="var(--dash-lime-muted, #d8f08a)" opacity="0.6" />
      <rect
        x="20"
        y="36"
        width="8"
        height="44"
        rx="1"
        fill="var(--dash-primary, #063f2a)"
        opacity="0.2"
      />
      <rect
        x="36"
        y="30"
        width="8"
        height="50"
        rx="1"
        fill="var(--dash-primary, #063f2a)"
        opacity="0.2"
      />
      <rect
        x="52"
        y="24"
        width="8"
        height="56"
        rx="1"
        fill="var(--dash-primary, #063f2a)"
        opacity="0.25"
      />
      <rect
        x="68"
        y="30"
        width="8"
        height="50"
        rx="1"
        fill="var(--dash-primary, #063f2a)"
        opacity="0.2"
      />
      <rect
        x="84"
        y="36"
        width="8"
        height="44"
        rx="1"
        fill="var(--dash-primary, #063f2a)"
        opacity="0.2"
      />
      <rect x="8" y="80" width="104" height="4" fill="var(--dash-primary, #063f2a)" opacity="0.35" />
      <g transform="translate(84 8)">
        <rect width="20" height="20" rx="4" fill="var(--dash-primary, #063f2a)" />
        <path
          d="M10 5v10M5 7l5-3 5 3"
          stroke="var(--dash-lime, #c7f13b)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
