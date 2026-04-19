'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';

const fieldInputClass =
  'mt-2 w-full rounded-2xl border border-brand-border bg-white px-5 py-4.5 text-lg text-brand-ink outline-none transition placeholder:text-brand-borderDeep hover:border-brand-borderDeep focus-visible:border-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange/25';

const continueClassName =
  'flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange text-lg font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.45)] transition hover:bg-brand-orangeHover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45';

function phoneLooksValid(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10;
}

function passwordStrongEnough(p: string): boolean {
  return p.length >= 8;
}

export function PersonalInfoStepForm() {
  const firstId = useId();
  const lastId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmId = useId();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const formOk = useMemo(() => {
    if (!firstName.trim() || !lastName.trim()) return false;
    if (!phoneLooksValid(phone)) return false;
    if (!passwordStrongEnough(password)) return false;
    if (password !== confirmPassword) return false;
    return true;
  }, [firstName, lastName, phone, password, confirmPassword]);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const passwordWeak = password.length > 0 && !passwordStrongEnough(password);

  return (
    <div>
      <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
        Tell us about you
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
        Create your account with a few details — you&apos;ll use this to sign in and track transfers.
      </p>

      <div className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="sm:col-span-1">
            <label htmlFor={firstId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
              First name
            </label>
            <input
              id={firstId}
              type="text"
              name="given-name"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Maria"
              className={fieldInputClass}
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor={lastId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
              Last name
            </label>
            <input
              id={lastId}
              type="text"
              name="family-name"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Silva"
              className={fieldInputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor={phoneId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Phone number
          </label>
          <input
            id={phoneId}
            type="tel"
            name="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+55 11 98765 4321"
            aria-invalid={phone.length > 0 && !phoneLooksValid(phone)}
            className={fieldInputClass}
          />
          {phone.length > 0 && !phoneLooksValid(phone) ? (
            <p className="mt-2 text-base text-brand-muted">Enter a number with at least 10 digits.</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={passwordId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Password
          </label>
          <input
            id={passwordId}
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            aria-invalid={passwordWeak}
            className={fieldInputClass}
          />
          {passwordWeak ? (
            <p className="mt-2 text-base text-brand-muted">Use at least 8 characters.</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={confirmId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Confirm password
          </label>
          <input
            id={confirmId}
            type="password"
            name="password-confirm"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            aria-invalid={passwordMismatch}
            className={fieldInputClass}
          />
          {passwordMismatch ? (
            <p className="mt-2 text-base text-brand-muted">Passwords don&apos;t match.</p>
          ) : null}
        </div>

        {formOk ? (
          <Link href="/signup/identity" className={continueClassName}>
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
