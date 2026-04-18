'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CircleFlag } from 'react-circle-flags';
import { NavBar } from '@/components/layout/NavBar';

const FEE_USD = 8.5;

/** Demo notional in USD — placeholders use live `perUSD` rates vs this anchor */
const DEMO_NOTIONAL_USD = 1;

/** Demo: units of this currency per 1 USD */
const CURRENCY = {
  USD: { countryCode: 'us', name: 'USD', perUSD: 1 },
  BRL: { countryCode: 'br', name: 'BRL', perUSD: 5.23 },
  EUR: { countryCode: 'eu', name: 'EUR', perUSD: 0.92 },
  GBP: { countryCode: 'gb', name: 'GBP', perUSD: 0.79 },
  CAD: { countryCode: 'ca', name: 'CAD', perUSD: 1.39 },
  MXN: { countryCode: 'mx', name: 'MXN', perUSD: 17.15 },
  INR: { countryCode: 'in', name: 'INR', perUSD: 84.5 },
} as const;

type CurrencyCode = keyof typeof CURRENCY;

const QUOTE_CURRENCIES: CurrencyCode[] = ['USD', 'BRL', 'EUR', 'GBP', 'CAD', 'MXN', 'INR'];

function firstAlternative(code: CurrencyCode): CurrencyCode {
  return QUOTE_CURRENCIES.find((c) => c !== code) ?? 'USD';
}

function toNumber(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatAmount(value: number, _currency: CurrencyCode): string {
  if (!Number.isFinite(value) || value === 0) return '';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Shown as input placeholder; always formatted, rate-consistent with `DEMO_NOTIONAL_USD` */
function formatExampleAmount(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const usd = amount / CURRENCY[from].perUSD;
  return usd * CURRENCY[to].perUSD;
}

function formatRate(send: CurrencyCode, receive: CurrencyCode): string {
  const cross = CURRENCY[send].perUSD / CURRENCY[receive].perUSD;
  return cross >= 1 ? cross.toFixed(3) : cross.toFixed(4);
}

export default function Home() {
  const [sendCurrency, setSendCurrency] = useState<CurrencyCode>('BRL');
  const [receiveCurrency, setReceiveCurrency] = useState<CurrencyCode>('USD');
  const [sendValue, setSendValue] = useState<string>('');
  const [receiveValue, setReceiveValue] = useState<string>('');
  const [swapSpin, setSwapSpin] = useState(0);

  const sendPlaceholder = useMemo(
    () =>
      formatExampleAmount(convert(DEMO_NOTIONAL_USD, 'USD', sendCurrency)),
    [sendCurrency],
  );

  const receivePlaceholder = useMemo(
    () =>
      formatExampleAmount(convert(DEMO_NOTIONAL_USD, 'USD', receiveCurrency)),
    [receiveCurrency],
  );

  const handleSendChange = (raw: string) => {
    setSendValue(raw);
    if (raw.trim() === '') {
      setReceiveValue('');
      return;
    }
    const n = toNumber(raw);
    const converted = convert(n, sendCurrency, receiveCurrency);
    setReceiveValue(formatAmount(converted, receiveCurrency));
  };

  const handleReceiveChange = (raw: string) => {
    setReceiveValue(raw);
    if (raw.trim() === '') {
      setSendValue('');
      return;
    }
    const n = toNumber(raw);
    const converted = convert(n, receiveCurrency, sendCurrency);
    setSendValue(formatAmount(converted, sendCurrency));
  };

  const handleSendCurrency = (c: CurrencyCode) => {
    let nextReceive = receiveCurrency;
    if (c === nextReceive) {
      nextReceive = firstAlternative(c);
      setReceiveCurrency(nextReceive);
    }
    setSendCurrency(c);

    const sendHas = sendValue.trim().length > 0;
    const recvHas = receiveValue.trim().length > 0;
    const sendNum = toNumber(sendValue);
    const recvNum = toNumber(receiveValue);

    if (sendHas) {
      setReceiveValue(formatAmount(convert(sendNum, c, nextReceive), nextReceive));
    } else if (recvHas) {
      setSendValue(formatAmount(convert(recvNum, nextReceive, c), c));
    } else {
      setSendValue('');
      setReceiveValue('');
    }
  };

  const handleReceiveCurrency = (c: CurrencyCode) => {
    const prevReceive = receiveCurrency;
    let nextSend = sendCurrency;
    if (c === nextSend) {
      nextSend = firstAlternative(c);
      setSendCurrency(nextSend);
    }
    setReceiveCurrency(c);

    const sendHas = sendValue.trim().length > 0;
    const recvHas = receiveValue.trim().length > 0;
    const sendNum = toNumber(sendValue);
    const recvNum = toNumber(receiveValue);

    if (sendHas) {
      setReceiveValue(formatAmount(convert(sendNum, nextSend, c), c));
    } else if (recvHas) {
      setSendValue(formatAmount(convert(recvNum, prevReceive, nextSend), nextSend));
    } else {
      setSendValue('');
      setReceiveValue('');
    }
  };

  const handleSwap = () => {
    setSwapSpin((s) => s + 180);
    const newSend = receiveCurrency;
    const newReceive = sendCurrency;
    const newSendValue = receiveValue;
    const newReceiveValue = sendValue;
    setSendCurrency(newSend);
    setReceiveCurrency(newReceive);
    setSendValue(newSendValue);
    setReceiveValue(newReceiveValue);
  };

  const liveRate = formatRate(sendCurrency, receiveCurrency);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <NavBar />

      {/* ————————————————————————————————————————— HERO ————————————————————————————————————————— */}
      <section className="relative overflow-hidden bg-brand-cream">
        {/* Decorative dot grid behind right column (desktop only) */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[45%] opacity-[0.35] lg:block"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(26,26,26,0.18) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          }}
        />
        {/* Soft warm glow behind the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[5%] top-[20%] hidden h-[560px] w-[560px] rounded-full blur-3xl lg:block"
          style={{
            background:
              'radial-gradient(circle, rgba(244,106,53,0.28) 0%, rgba(244,106,53,0) 70%)',
          }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-24 pt-16 sm:px-8 lg:flex-row lg:items-center lg:gap-12 lg:pb-32 lg:pt-24">
          {/* ————— LEFT: Copy (60%) ————— */}
          <div className="flex-1 lg:basis-3/5">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-orange" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-mutedDeep">
                For international students
                <span className="mx-2 text-brand-border">·</span>
                40+ countries
              </p>
            </div>

            {/* Headline */}
            <h1 className="mt-7 font-display text-5xl leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-[72px] lg:leading-[0.98]">
              Pay US tuition in{' '}
              <span className="italic text-brand-ink/90">your&nbsp;own</span>
              <br className="hidden sm:block" /> currency.
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-mutedDeep sm:text-xl">
              1% flat fee
              <span className="mx-2 text-brand-borderDeep">·</span>
              ~2 hour settlement
              <span className="mx-2 text-brand-borderDeep">·</span>
              no hidden FX spread.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/signup"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand-orange px-8 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.55)] transition-all duration-200 hover:bg-brand-orangeHover hover:shadow-[0_12px_32px_-8px_rgba(244,106,53,0.65)] active:translate-y-px"
              >
                Start a transfer
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-14 items-center justify-center rounded-full border border-brand-ink/15 bg-transparent px-8 text-base font-semibold text-brand-ink transition-colors hover:border-brand-ink/40 hover:bg-brand-ink/[0.03]"
              >
                See how it works
              </a>
            </div>

            {/* Stats row */}
            <dl className="mt-14 grid grid-cols-2 gap-y-8 border-t border-brand-borderDeep/60 pt-8 sm:grid-cols-4 sm:gap-0">
              {[
                { value: '40+', label: 'countries' },
                { value: '~2h', label: 'settlement' },
                { value: '1%', label: 'flat fee' },
                { value: '$0', label: 'hidden spread' },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  className={[
                    'flex flex-col gap-1.5',
                    idx > 0 ? 'sm:border-l sm:border-brand-borderDeep/60 sm:pl-6' : '',
                    idx === 0 ? 'sm:pr-6' : '',
                    idx > 0 && idx < 3 ? 'sm:pr-6' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <dt className="font-body text-4xl font-semibold leading-none tracking-tight text-brand-ink tabular-nums sm:text-[40px]">
                    {stat.value}
                  </dt>
                  <dd className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-mutedDeep">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ————— RIGHT: Quick Quote Card (40%) ————— */}
          <div className="relative w-full lg:basis-2/5">
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-brand-borderDeep/60 bg-white p-6 shadow-quote sm:p-7">
              {/* Card header — live rate pinned top-right */}
              <div className="relative">
                <h2 className="pr-28 font-body text-2xl font-semibold leading-none tracking-tight text-brand-ink">
                  Quick quote
                </h2>
                <span className="absolute right-0 top-0 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-mutedDeep">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-success opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-success" />
                  </span>
                  live rate
                </span>
              </div>

              {/* Send + Receive group — wrapped so we can position the swap button between them */}
              <div className="relative mt-6">
                <CurrencyField
                  fieldId="quote-send"
                  label="you send"
                  value={sendValue}
                  placeholder={sendPlaceholder}
                  currency={sendCurrency}
                  onChange={handleSendChange}
                  onCurrencyChange={handleSendCurrency}
                />

                <div className="my-2 h-px bg-brand-border" />

                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Swap currencies"
                  className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-borderDeep bg-white text-brand-ink transition-all duration-300 hover:border-brand-ink hover:bg-brand-cream"
                  style={{ transform: `translate(-50%, -50%) rotate(${swapSpin}deg)` }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M4.5 2v12m0 0L2 11.5M4.5 14L7 11.5M11.5 14V2m0 0L9 4.5M11.5 2L14 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <CurrencyField
                  fieldId="quote-receive"
                  label="you receive"
                  value={receiveValue}
                  placeholder={receivePlaceholder}
                  currency={receiveCurrency}
                  onChange={handleReceiveChange}
                  onCurrencyChange={handleReceiveCurrency}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-brand-mutedDeep">
                <InfoChip label="rate" value={liveRate} />
                <span className="text-brand-border">·</span>
                <InfoChip label="fee" value={`$${FEE_USD.toFixed(2)}`} />
                <span className="text-brand-border">·</span>
                <InfoChip label="arrives" value="today" />
              </div>

              <button
                type="button"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-orange text-base font-semibold text-white transition-all duration-200 hover:bg-brand-orangeHover active:translate-y-px"
              >
                Start transfer
                <span aria-hidden>→</span>
              </button>

              <p className="mt-4 text-center text-[11px] uppercase tracking-[0.14em] text-brand-muted">
                Secured &amp; regulated · Locked rate for 30 min
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ————————————————————————————————————————————————————————————————————————————————————————— */

function CurrencyField({
  fieldId,
  label,
  value,
  placeholder,
  currency,
  onChange,
  onCurrencyChange,
}: {
  fieldId: string;
  label: string;
  value: string;
  placeholder: string;
  currency: CurrencyCode;
  onChange: (raw: string) => void;
  onCurrencyChange: (c: CurrencyCode) => void;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl px-1 py-3 transition-colors focus-within:bg-brand-cream/60">
      <div className="flex-1">
        <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-brand-muted">
          {label}
        </label>
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-transparent font-body text-3xl font-semibold tracking-tight text-brand-ink tabular-nums outline-none placeholder:text-brand-border sm:text-[32px]"
          aria-label={label}
        />
      </div>

      <CurrencyDropdown id={fieldId} value={currency} onChange={onCurrencyChange} />
    </div>
  );
}

function CurrencyDropdown({
  id,
  value,
  onChange,
}: {
  id: string;
  value: CurrencyCode;
  onChange: (c: CurrencyCode) => void;
}) {
  const reactId = useId();
  const listboxId = `${id}-${reactId}-listbox`;
  const triggerId = `${id}-${reactId}-trigger`;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const meta = CURRENCY[value];

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-3 py-2 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink/40 hover:bg-brand-cream"
      >
        <CircleFlag
          countryCode={meta.countryCode}
          height={20}
          width={20}
          className="h-5 w-5 shrink-0 rounded-full object-cover"
          alt=""
          aria-hidden
        />
        <span>{meta.name}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className={`shrink-0 text-brand-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M2 4l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className="absolute right-0 top-[calc(100%+0.375rem)] z-30 max-h-56 min-w-[11rem] overflow-y-auto rounded-xl border border-brand-border bg-white py-1 shadow-lg"
        >
          {QUOTE_CURRENCIES.map((code) => {
            const m = CURRENCY[code];
            const selected = code === value;
            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-brand-cream text-brand-ink'
                      : 'text-brand-ink hover:bg-brand-cream/70'
                  }`}
                  onClick={() => {
                    onChange(code);
                    setOpen(false);
                  }}
                >
                  <CircleFlag
                    countryCode={m.countryCode}
                    height={18}
                    width={18}
                    className="h-[18px] w-[18px] shrink-0 rounded-full object-cover"
                    alt=""
                    aria-hidden
                  />
                  <span className="tabular-nums">{m.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.14em] text-brand-muted">
        {label}
      </span>
      <span className="font-semibold text-brand-ink tabular-nums">{value}</span>
    </span>
  );
}
