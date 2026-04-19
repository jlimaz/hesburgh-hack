export default function TransactionsPage() {
  return (
    <div className="rounded-2xl border border-brand-borderDeep/70 bg-white p-6 shadow-[0_14px_36px_-22px_rgba(26,26,26,0.34)]">
      <div className="font-display text-2xl tracking-tight text-brand-ink">
        Transaction History
      </div>
      <div className="mt-2 text-sm text-brand-mutedDeep">
        This route is wired up for navigation. The full table UI currently lives on{' '}
        <span className="font-semibold text-brand-ink">/dashboard</span>.
      </div>
    </div>
  );
}

