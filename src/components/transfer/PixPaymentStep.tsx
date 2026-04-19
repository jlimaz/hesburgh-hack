'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PIX_TRANSFER_DEMO } from '@/lib/transfer-demo';

const INITIAL_SECONDS = 5 * 60;

function formatCountdown(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PixPaymentStep() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const t = window.setInterval(() => {
      setSecondsLeft((x) => Math.max(0, x - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  const labelClass =
    'text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted';
  const valueClass = 'mt-1 font-body text-lg font-semibold text-brand-ink tabular-nums';
  const panelClass =
    'rounded-2xl border border-brand-borderDeep/60 bg-white p-6 shadow-[0_1px_0_rgba(26,26,26,0.04)] sm:p-7';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
          PIX Payment — Brazil
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
          Complete your payment using PIX to fund your money transfer.
        </p>
      </div>

      {/* Timer */}
      <div
        className={`${panelClass} flex flex-row items-center justify-between gap-4 sm:gap-8`}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand-ink">Quote expires in:</p>
          <p className="mt-1 text-sm text-brand-muted">Complete payment before timer expires</p>
        </div>
        <p
          className="shrink-0 font-body text-4xl font-semibold tabular-nums tracking-tight text-brand-orange sm:text-5xl"
          aria-live="polite"
        >
          {secondsLeft > 0 ? formatCountdown(secondsLeft) : '0:00'}
        </p>
      </div>

      <div className={panelClass}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div>
            <h2 className="font-body text-lg font-semibold text-brand-ink">Payment details</h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className={labelClass}>Amount to pay</dt>
              <dd className={valueClass}>{PIX_TRANSFER_DEMO.amountBrl} BRL</dd>
            </div>
            <div>
              <dt className={labelClass}>USD amount</dt>
              <dd className={valueClass}>${PIX_TRANSFER_DEMO.amountUsd}</dd>
            </div>
            <div>
              <dt className={labelClass}>Exchange rate</dt>
              <dd className={valueClass}>{PIX_TRANSFER_DEMO.rateLabel}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="font-body text-lg font-semibold text-brand-ink">PIX QR code</h2>
            <button
              type="button"
              onClick={() => router.push('/transfer/confirm')}
              className="relative mt-6 flex aspect-square w-full max-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand-border bg-white p-4 text-left transition hover:border-brand-orange/60 hover:ring-2 hover:ring-brand-orange/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
              aria-label="Simulate PIX payment: tap to continue to confirmation"
            >
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full max-h-[220px] text-brand-ink pointer-events-none"
                role="img"
                aria-hidden
              >
                <title>PIX QR code placeholder</title>
                {Array.from({ length: 100 }).map((_, i) => {
                  const row = Math.floor(i / 10);
                  const col = i % 10;
                  if ((row * 17 + col * 13) % 3 !== 0) return null;
                  return (
                    <rect
                      key={i}
                      x={4 + col * 9.2}
                      y={4 + row * 9.2}
                      width={7.5}
                      height={7.5}
                      rx={1}
                      className="fill-current"
                    />
                  );
                })}
              </svg>
            </button>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              Tap the QR code to simulate payment and continue (demo).
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className={panelClass}>
        <h2 className="font-body text-lg font-semibold text-brand-ink">Transaction progress</h2>
        <div className="mt-4 flex items-start gap-3">
          <span
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400 ring-2 ring-amber-400/30"
            aria-hidden
          />
          <div>
            <p className="font-semibold text-brand-ink">PIX payment</p>
            <p className="mt-1 text-sm text-brand-muted">Waiting for PIX payment confirmation</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className={panelClass}>
        <h2 className="font-body text-lg font-semibold text-brand-ink">How PIX payment works</h2>
        <ol className="mt-6 space-y-5">
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cream text-sm font-bold text-brand-orange">
              1
            </span>
            <div>
              <p className="font-semibold text-brand-ink">Scan QR code</p>
              <p className="mt-1 text-sm text-brand-muted">Use your banking app to scan the PIX QR code.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cream text-sm font-bold text-brand-orange">
              2
            </span>
            <div>
              <p className="font-semibold text-brand-ink">Confirm payment</p>
              <p className="mt-1 text-sm text-brand-muted">Verify the amount and complete the PIX transfer.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cream text-sm font-bold text-brand-orange">
              3
            </span>
            <div>
              <p className="font-semibold text-brand-ink">Instant processing</p>
              <p className="mt-1 text-sm text-brand-muted">Your payment is processed immediately.</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="border-t border-brand-border pt-8">
        <Link
          href="/transfer/transaction"
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl border-2 border-brand-borderDeep bg-white px-8 text-base font-semibold text-brand-ink transition hover:border-brand-ink/25 hover:bg-brand-cream sm:w-auto"
        >
          Back to quote
        </Link>
        <p className="mt-6 text-left text-sm text-brand-muted">
          Tap the QR code to continue to confirmation (demo). Use Back to quote to change the amount.
        </p>
      </div>
    </div>
  );
}
