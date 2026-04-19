import { QuickQuoteCard } from '@/components/quote/QuickQuoteCard';

export default function TransferTransactionPage() {
  return (
    <div>
      <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
        Transaction
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
        Choose how much you&apos;re sending and what you&apos;ll receive.
      </p>
      <div className="mt-8">
        <QuickQuoteCard
          variant="flow"
          continueHref="/transfer/payment"
          fieldIdPrefix="transfer-tx"
        />
      </div>
    </div>
  );
}
