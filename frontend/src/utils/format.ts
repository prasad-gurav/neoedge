export function formatMinor(amountMinor: string | number, currency: string): string {
  const s = typeof amountMinor === 'string' ? amountMinor : String(amountMinor);
  const negative = s.startsWith('-');
  const digits = negative ? s.slice(1) : s;
  const padded = digits.padStart(3, '0');
  const major = padded.slice(0, -2);
  const minor = padded.slice(-2);
  const withCommas = Number(major).toLocaleString('en-US');
  return `${negative ? '-' : ''}${formatCurrencySymbol(currency)}${withCommas}.${minor}`;
}

export function formatCurrencySymbol(currency: string): string {
  switch (currency.toUpperCase()) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'INR':
      return '₹';
    default:
      return `${currency.toUpperCase()} `;
  }
}

export function randomIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
