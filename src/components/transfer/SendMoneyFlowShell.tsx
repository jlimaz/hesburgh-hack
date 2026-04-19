'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TRANSFER_FLOW_TOTAL_STEPS,
  transferPreviousHref,
  transferStepFromPathname,
} from '@/lib/transfer-flow';

export function SendMoneyFlowShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/transfer';
  const step = transferStepFromPathname(pathname);
  const total = TRANSFER_FLOW_TOTAL_STEPS;
  const backHref = transferPreviousHref(pathname);
  const backLabel = 'Back';

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="mx-auto w-full max-w-2xl px-6 pb-20 pt-10 sm:px-10 lg:px-12">
        <header className="flex items-start justify-between gap-8">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 text-base font-medium text-brand-muted transition-colors hover:text-brand-orange"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            {backLabel}
          </Link>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <p className="text-base font-semibold tabular-nums text-brand-ink">
              {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            <div
              className="flex h-2 w-[12rem] gap-1.5 sm:w-[14rem]"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-label={`Step ${step} of ${total}`}
            >
              {Array.from({ length: total }, (_, i) => {
                const segmentStep = i + 1;
                const done = segmentStep < step;
                const current = segmentStep === step;
                return (
                  <span
                    key={i}
                    className={[
                      'h-full min-w-0 flex-1 rounded-full transition-colors',
                      done || current ? 'bg-brand-orange' : 'bg-brand-border',
                      current ? 'ring-2 ring-brand-orange ring-offset-2 ring-offset-brand-cream' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                );
              })}
            </div>
          </div>
        </header>

        <div className="mt-14 sm:mt-16">{children}</div>
      </div>
    </div>
  );
}
