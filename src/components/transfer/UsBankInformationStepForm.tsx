'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';

const fieldInputClass =
  'mt-2 w-full rounded-2xl border border-brand-border bg-white px-5 py-4.5 text-lg text-brand-ink outline-none transition placeholder:text-brand-borderDeep hover:border-brand-borderDeep focus-visible:border-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange/25';

const continueClassName =
  'flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange text-lg font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.45)] transition hover:bg-brand-orangeHover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45';

function routingNumberValid(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 9;
}

function accountNumberValid(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 4 && digits.length <= 17;
}

export function UsBankInformationStepForm() {
  const holderId = useId();
  const bankId = useId();
  const routingId = useId();
  const accountId = useId();

  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const formOk = useMemo(() => {
    if (!accountHolderName.trim() || !bankName.trim()) return false;
    if (!routingNumberValid(routingNumber)) return false;
    if (!accountNumberValid(accountNumber)) return false;
    return true;
  }, [accountHolderName, bankName, routingNumber, accountNumber]);

  const routingTouched = routingNumber.length > 0;
  const routingInvalid = routingTouched && !routingNumberValid(routingNumber);
  const accountTouched = accountNumber.length > 0;
  const accountInvalid = accountTouched && !accountNumberValid(accountNumber);

  return (
    <div>
      <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
        US bank information
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
        Add the US account that will receive your exchange. Use the name exactly as it appears on the account.
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor={holderId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Account holder name
          </label>
          <input
            id={holderId}
            type="text"
            name="account-holder"
            autoComplete="name"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            placeholder="Full name on the account"
            className={fieldInputClass}
          />
        </div>

        <div>
          <label htmlFor={bankId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Bank name
          </label>
          <input
            id={bankId}
            type="text"
            name="organization"
            autoComplete="organization"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. Chase, Bank of America"
            className={fieldInputClass}
          />
        </div>

        <div>
          <label htmlFor={routingId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Routing number
          </label>
          <input
            id={routingId}
            type="text"
            name="routing-number"
            inputMode="numeric"
            autoComplete="off"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 9))}
            placeholder="9-digit ABA routing number"
            aria-invalid={routingInvalid}
            className={fieldInputClass}
          />
          {routingInvalid ? (
            <p className="mt-2 text-base text-brand-muted">Enter a valid 9-digit routing number.</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={accountId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Account number
          </label>
          <input
            id={accountId}
            type="text"
            name="account-number"
            inputMode="numeric"
            autoComplete="off"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 17))}
            placeholder="Checking or savings account number"
            aria-invalid={accountInvalid}
            className={fieldInputClass}
          />
          {accountInvalid ? (
            <p className="mt-2 text-base text-brand-muted">Use 4–17 digits.</p>
          ) : null}
        </div>

        {formOk ? (
          <Link href="/transfer/transaction" className={continueClassName}>
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
    </div>
  );
}
