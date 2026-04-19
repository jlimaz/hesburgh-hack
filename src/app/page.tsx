'use client';

import Link from 'next/link';
import { NavBar } from '@/components/layout/NavBar';
import { QuickQuoteCard } from '@/components/quote/QuickQuoteCard';

export default function Home() {
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
            <QuickQuoteCard variant="marketing" fieldIdPrefix="home-quote" />
          </div>
        </div>
      </section>
    </div>
  );
}
