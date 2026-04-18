'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { FlowbiteDateInput } from '@/components/signup/FlowbiteDateInput';
import { RESIDENCE_COUNTRIES } from '@/lib/residence-countries';

const fieldInputClass =
  'mt-2 w-full rounded-2xl border border-brand-border bg-white px-5 py-4.5 text-lg text-brand-ink outline-none transition placeholder:text-brand-borderDeep hover:border-brand-borderDeep focus-visible:border-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange/25';

const selectClassName = `${fieldInputClass} cursor-pointer appearance-none bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12`;

const continueClassName =
  'flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange text-lg font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.45)] transition hover:bg-brand-orangeHover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45';

const SELECT_CHEVRON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E";

function parseDobLocal(isoDate: string): Date | null {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

function isAtLeastYearsOld(isoDate: string, years: number): boolean {
  const birth = parseDobLocal(isoDate);
  if (!birth) return false;
  const today = new Date();
  const cutoff = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
  return birth <= cutoff;
}

function nationalIdLooksValid(value: string): boolean {
  return value.trim().length >= 5;
}

export function IdentityVerificationStepForm() {
  const countryId = useId();
  const nationalIdFieldId = useId();
  const dobId = useId();

  const [country, setCountry] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const dobValid = dateOfBirth.length > 0 && parseDobLocal(dateOfBirth) !== null;
  const dobInFuture =
    dobValid && parseDobLocal(dateOfBirth)! > new Date(new Date().setHours(23, 59, 59, 999));
  const ageOk = dobValid && !dobInFuture && isAtLeastYearsOld(dateOfBirth, 18);
  const ageTooYoung =
    dobValid && !dobInFuture && !isAtLeastYearsOld(dateOfBirth, 18);

  const nationalIdOk = nationalIdLooksValid(nationalId);
  const nationalIdTouched = nationalId.length > 0;

  const formOk = useMemo(() => {
    if (!country) return false;
    if (!nationalIdOk) return false;
    if (!dobValid || dobInFuture) return false;
    if (!ageOk) return false;
    return true;
  }, [country, nationalIdOk, dobValid, dobInFuture, ageOk]);

  const maxDobDate = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  return (
    <div>
      <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
        Verify your identity
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
        We need a few details to meet regulatory requirements and keep your account secure.
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor={countryId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Country of residence
          </label>
          <select
            id={countryId}
            name="country"
            autoComplete="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ backgroundImage: `url("${SELECT_CHEVRON}")` }}
            className={selectClassName}
          >
            <option value="">Select country</option>
            {RESIDENCE_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={nationalIdFieldId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            National ID
          </label>
          <input
            id={nationalIdFieldId}
            type="text"
            name="national-id"
            autoComplete="off"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="e.g. CPF, national ID number"
            aria-invalid={nationalIdTouched && !nationalIdOk}
            className={fieldInputClass}
          />
          {nationalIdTouched && !nationalIdOk ? (
            <p className="mt-2 text-base text-brand-muted">Enter at least 5 characters.</p>
          ) : (
            <p className="mt-2 text-base text-brand-muted">
              Government-issued ID for your country (numbers and letters as shown on the document).
            </p>
          )}
        </div>

        <div>
          <label htmlFor={dobId} className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Date of birth
          </label>
          <FlowbiteDateInput
            id={dobId}
            name="bday"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            maxDate={maxDobDate}
            className={`${fieldInputClass} cursor-pointer`}
          />
          {dobInFuture ? (
            <p className="mt-2 text-base text-brand-muted">Date cannot be in the future.</p>
          ) : null}
          {ageTooYoung ? (
            <p className="mt-2 text-base text-brand-muted">You must be at least 18 years old.</p>
          ) : null}
        </div>

        {formOk ? (
          <Link href="/signup/complete" className={continueClassName}>
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
