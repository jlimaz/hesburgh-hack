'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';

function isValidEmail(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={`text-brand-success ${className ?? ''}`} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="M6 10.2 8.5 12.7 14 7.2"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SchoolEmailStepForm() {
  const emailId = useId();

  const [email, setEmail] = useState('');

  const emailOk = useMemo(() => isValidEmail(email), [email]);

  const continueClassName =
    'flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange text-lg font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.45)] transition hover:bg-brand-orangeHover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45';

  return (
    <div>
      <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
        What&apos;s your email?
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
        We&apos;ll use it for transfer updates and your student rate — 1% flat, no spread.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor={emailId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Email address
          </label>
          <div className="relative mt-2">
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={email.length > 0 && !emailOk}
              className={[
                'w-full rounded-2xl border bg-white px-5 py-4.5 text-lg text-brand-ink outline-none transition placeholder:text-brand-borderDeep',
                emailOk ? 'pr-14' : '',
                'focus-visible:ring-2 focus-visible:ring-brand-orange/30',
                emailOk
                  ? 'border-brand-success ring-1 ring-brand-success'
                  : 'border-brand-border hover:border-brand-borderDeep',
              ].join(' ')}
            />
            {emailOk ? (
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <CheckIcon className="h-7 w-7" />
              </span>
            ) : null}
          </div>
          {emailOk ? (
            <p className="mt-2 flex items-center gap-2 text-base font-medium text-brand-success">
              <span aria-hidden>✓</span>
              Valid email · you&apos;re eligible for student rates
            </p>
          ) : email.trim().length > 0 ? (
            <p className="mt-2 text-base text-brand-muted">Please enter a valid email address.</p>
          ) : null}
        </div>

        {emailOk ? (
          <Link href="/signup/personal" className={continueClassName}>
            Continue
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <button type="button" disabled className={continueClassName}>
            Continue
            <span aria-hidden>→</span>
          </button>
        )}
      </div>

      <div className="mt-8 flex items-center gap-5">
        <div className="h-px flex-1 bg-brand-border" />
        <span className="shrink-0 text-sm font-medium uppercase tracking-wider text-brand-muted">
          or continue with
        </span>
        <div className="h-px flex-1 bg-brand-border" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl border border-brand-border bg-white text-base font-semibold text-brand-ink transition hover:border-brand-borderDeep hover:bg-brand-cream/50"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl border border-brand-border bg-white text-base font-semibold text-brand-ink transition hover:border-brand-borderDeep hover:bg-brand-cream/50"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Apple
        </button>
      </div>
    </div>
  );
}
