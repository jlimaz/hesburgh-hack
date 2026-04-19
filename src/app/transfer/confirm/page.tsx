'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { FEE_USD } from '@/lib/quote';
import { PIX_TRANSFER_DEMO, buildDemoInvoiceText } from '@/lib/transfer-demo';

const panelClass =
  'rounded-2xl border border-brand-borderDeep/60 bg-white p-6 shadow-[0_1px_0_rgba(26,26,26,0.04)] sm:p-7';

const labelClass =
  'text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted';
const valueClass = 'mt-1 font-body text-lg font-semibold text-brand-ink tabular-nums';

const primaryClassName =
  'inline-flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange text-lg font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.45)] transition hover:bg-brand-orangeHover active:translate-y-px sm:w-auto sm:min-w-[14rem]';

const secondaryClassName =
  'inline-flex h-16 w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-borderDeep bg-white px-8 text-lg font-semibold text-brand-ink transition hover:border-brand-ink/25 hover:bg-brand-cream sm:w-auto sm:min-w-[14rem]';

export default function TransferConfirmPage() {
  const handleDownloadInvoice = useCallback(() => {
    const body = buildDemoInvoiceText();
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${PIX_TRANSFER_DEMO.referenceId}.txt`;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div>
      <h1 className="flex flex-wrap items-center gap-2.5 font-body text-3xl font-semibold tracking-tight text-brand-ink sm:gap-3 sm:text-4xl sm:leading-tight">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_3px_10px_-3px_rgba(244,106,53,0.5)] sm:h-9 sm:w-9"
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        Transfer confirmed
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
        Your PIX payment is recorded. Here&apos;s a summary of this transfer.
      </p>

      <div className={`${panelClass} mt-10`}>
        <h2 className="font-body text-lg font-semibold text-brand-ink">Transaction summary</h2>
        <dl className="mt-6 space-y-5">
          <div>
            <dt className={labelClass}>Status</dt>
            <dd className={valueClass}>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-success" aria-hidden />
                Confirmed
              </span>
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Reference</dt>
            <dd className={valueClass}>{PIX_TRANSFER_DEMO.referenceId}</dd>
          </div>
          <div>
            <dt className={labelClass}>You paid (PIX)</dt>
            <dd className={valueClass}>{PIX_TRANSFER_DEMO.amountBrl} BRL</dd>
          </div>
          <div>
            <dt className={labelClass}>Recipient receives</dt>
            <dd className={valueClass}>${PIX_TRANSFER_DEMO.amountUsd} USD</dd>
          </div>
          <div>
            <dt className={labelClass}>Exchange rate</dt>
            <dd className={valueClass}>{PIX_TRANSFER_DEMO.rateLabel}</dd>
          </div>
          <div>
            <dt className={labelClass}>Fee</dt>
            <dd className={valueClass}>${FEE_USD.toFixed(2)} USD</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <button type="button" onClick={handleDownloadInvoice} className={secondaryClassName}>
          Download invoice
        </button>
        <Link href="/dashboard" className={primaryClassName}>
          Go to dashboard
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
