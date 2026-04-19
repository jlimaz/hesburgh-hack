import Link from 'next/link';

export default function SendMoneyPage() {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl tracking-tight text-brand-ink sm:text-3xl">Send money</h1>
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-brand-mutedDeep underline-offset-4 hover:text-brand-ink hover:underline"
        >
          ← Back to transactions
        </Link>
      </div>
      <p className="mt-2 max-w-lg text-sm text-brand-mutedDeep">
        Start a new transfer from here. Full flow is coming soon.
      </p>
      <div className="mt-8 rounded-xl border border-brand-borderDeep/50 bg-white p-8 text-center text-sm text-brand-mutedDeep">
        Transfer form placeholder
      </div>
    </div>
  );
}

