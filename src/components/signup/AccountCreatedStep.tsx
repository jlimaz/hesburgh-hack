import Link from 'next/link';

export function AccountCreatedStep() {
  return (
    <div>
      <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
        Your account is ready
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
        You&apos;re all set. Open your dashboard anytime, or continue to complete your exchange.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <Link
          href="/transfer"
          className="flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-orange text-lg font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.45)] transition hover:bg-brand-orangeHover active:translate-y-px"
        >
          Continue with exchange
          <span aria-hidden>→</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-brand-borderDeep bg-white text-lg font-semibold text-brand-ink transition hover:border-brand-ink/25 hover:bg-white"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
