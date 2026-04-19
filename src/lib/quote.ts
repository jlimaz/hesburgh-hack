/** Demo notional in USD — placeholders use live `perUSD` rates vs this anchor */
export const DEMO_NOTIONAL_USD = 1;

export const FEE_USD = 8.5;

/** Demo: units of this currency per 1 USD */
export const CURRENCY = {
  USD: { countryCode: 'us', name: 'USD', perUSD: 1 },
  BRL: { countryCode: 'br', name: 'BRL', perUSD: 5.23 },
  EUR: { countryCode: 'eu', name: 'EUR', perUSD: 0.92 },
  GBP: { countryCode: 'gb', name: 'GBP', perUSD: 0.79 },
  CAD: { countryCode: 'ca', name: 'CAD', perUSD: 1.39 },
  MXN: { countryCode: 'mx', name: 'MXN', perUSD: 17.15 },
  INR: { countryCode: 'in', name: 'INR', perUSD: 84.5 },
} as const;

export type CurrencyCode = keyof typeof CURRENCY;

export const QUOTE_CURRENCIES: CurrencyCode[] = ['USD', 'BRL', 'EUR', 'GBP', 'CAD', 'MXN', 'INR'];

export function firstAlternative(code: CurrencyCode): CurrencyCode {
  return QUOTE_CURRENCIES.find((c) => c !== code) ?? 'USD';
}

export function toNumber(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatAmount(value: number, _currency: CurrencyCode): string {
  if (!Number.isFinite(value) || value === 0) return '';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Shown as input placeholder; always formatted, rate-consistent with `DEMO_NOTIONAL_USD` */
export function formatExampleAmount(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const usd = amount / CURRENCY[from].perUSD;
  return usd * CURRENCY[to].perUSD;
}

export function formatRate(send: CurrencyCode, receive: CurrencyCode): string {
  const cross = CURRENCY[send].perUSD / CURRENCY[receive].perUSD;
  return cross >= 1 ? cross.toFixed(3) : cross.toFixed(4);
}
