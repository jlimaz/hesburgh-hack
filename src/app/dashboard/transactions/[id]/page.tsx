import Link from 'next/link';

type TransactionDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TransactionDetailsPage({
  params,
}: TransactionDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl tracking-tight text-brand-ink sm:text-3xl">
          Transaction details
        </h1>
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-brand-mutedDeep underline-offset-4 hover:text-brand-ink hover:underline"
        >
          ← Back to transactions
        </Link>
      </div>

      <div className="mt-5 rounded-xl border border-brand-borderDeep/60 bg-white p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-mutedDeep">
          Transaction ID
        </div>
        <div className="mt-1 font-mono text-sm text-brand-ink">{id}</div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-mutedDeep">
              Status
            </div>
            <div className="mt-1 text-sm font-semibold text-brand-ink">Completed</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-mutedDeep">
              Amount
            </div>
            <div className="mt-1 text-sm font-semibold text-brand-ink">$27.60 USD</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-mutedDeep">
              Recipient
            </div>
            <div className="mt-1 text-sm font-semibold text-brand-ink">Alice Brown</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-mutedDeep">
              Date
            </div>
            <div className="mt-1 text-sm font-semibold text-brand-ink">Jan 16, 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
