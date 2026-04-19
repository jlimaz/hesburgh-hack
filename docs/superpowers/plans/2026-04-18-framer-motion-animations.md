# Framer Motion Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add purposeful Framer Motion animations (step transitions, state changes, staggered field reveals) to the signup and transfer flows without touching routing, business logic, or styling.

**Architecture:** Both flow shells wrap `{children}` in `AnimatePresence mode="wait"` keyed to the current pathname; direction (forward vs back) is inferred by comparing the current step number to the previous one stored in a `useRef`. Individual form components gain staggered `motion.div` field groups on mount and `AnimatePresence`-wrapped validation messages. Success states get spring/fade-in animations on mount.

**Tech Stack:** framer-motion (new dependency), Next.js 16 App Router, React 19, Jest + Testing Library

---

## File Map

| File | Change |
|------|--------|
| `package.json` | Add `framer-motion` |
| `src/components/signup/SignupFlowShell.tsx` | Direction-aware `AnimatePresence` wrapping `{children}` |
| `src/components/transfer/SendMoneyFlowShell.tsx` | Same as above |
| `src/components/signup/SchoolEmailStepForm.tsx` | Field stagger + check icon AnimatePresence + validation message AnimatePresence |
| `src/components/signup/PersonalInfoStepForm.tsx` | Field stagger + validation message AnimatePresence |
| `src/components/signup/IdentityVerificationStepForm.tsx` | Field stagger + validation message AnimatePresence |
| `src/components/signup/AccountCreatedStep.tsx` | Add `'use client'`, mount stagger on heading/subtitle/buttons |
| `src/components/transfer/UsBankInformationStepForm.tsx` | Field stagger + validation message AnimatePresence |
| `src/components/transfer/PixPaymentStep.tsx` | Panel stagger |
| `src/app/transfer/confirm/page.tsx` | Checkmark spring entry + summary panel fade |
| `src/components/signup/SignupFlowShell.test.tsx` | Smoke test for shell with mocked framer-motion + next/navigation |

---

### Task 1: Install framer-motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the dependency**

```bash
npm install framer-motion
```

Expected: framer-motion appears in `dependencies` in `package.json`. No peer-dependency warnings for React 19.

- [ ] **Step 2: Verify the import resolves**

```bash
node -e "require('framer-motion')"
```

Expected: exits with code 0, no output.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion"
```

---

### Task 2: SignupFlowShell — direction-aware step transition

**Files:**
- Modify: `src/components/signup/SignupFlowShell.tsx`
- Create: `src/components/signup/SignupFlowShell.test.tsx`

**How direction works:** `signupStepFromPathname` returns the current step number (already imported). A `dirRef` stores `1` (forward) or `-1` (back). When the step number changes, `dirRef` is updated before rendering. The entry animation uses `x: direction * 48` (slides in from the right when going forward, from the left when going back). Exit is a pure opacity fade so the exit variant doesn't need to know direction.

- [ ] **Step 1: Write the failing smoke test**

Create `src/components/signup/SignupFlowShell.test.tsx`:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SignupFlowShell } from './SignupFlowShell';

jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...rest}>{children}</div>
    ),
  },
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/signup',
}));

describe('SignupFlowShell', () => {
  it('renders children', () => {
    render(<SignupFlowShell><p>step content</p></SignupFlowShell>);
    expect(screen.getByText('step content')).toBeInTheDocument();
  });

  it('renders progress bar with correct step count', () => {
    const { container } = render(<SignupFlowShell><p>x</p></SignupFlowShell>);
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest SignupFlowShell.test --no-coverage
```

Expected: FAIL — framer-motion is not yet imported in the shell, but the test should at least fail on import errors (component hasn't changed yet, so it may actually pass the existing renders — that's fine, proceed).

- [ ] **Step 3: Rewrite SignupFlowShell.tsx with AnimatePresence**

Replace the entire file content:

```tsx
'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SIGNUP_FLOW_TOTAL_STEPS,
  signupPreviousHref,
  signupStepFromPathname,
} from '@/lib/signup-flow';

export function SignupFlowShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/signup';
  const step = signupStepFromPathname(pathname);
  const total = SIGNUP_FLOW_TOTAL_STEPS;
  const backHref = signupPreviousHref(pathname);
  const backLabel = backHref === '/' ? 'Back to home' : 'Back';

  const prevStepRef = useRef(step);
  const dirRef = useRef<1 | -1>(1);
  if (step !== prevStepRef.current) {
    dirRef.current = step > prevStepRef.current ? 1 : -1;
    prevStepRef.current = step;
  }
  const direction = dirRef.current;

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="mx-auto w-full max-w-2xl px-6 pb-20 pt-10 sm:px-10 lg:px-12">
        <header className="flex items-start justify-between gap-8">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 text-base font-medium text-brand-muted transition-colors hover:text-brand-orange"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            {backLabel}
          </Link>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <p className="text-base font-semibold tabular-nums text-brand-ink">
              {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            <div
              className="flex h-2 w-[12rem] gap-1.5 sm:w-[14rem]"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-label={`Step ${step} of ${total}`}
            >
              {Array.from({ length: total }, (_, i) => {
                const segmentStep = i + 1;
                const done = segmentStep < step;
                const current = segmentStep === step;
                return (
                  <span
                    key={i}
                    className={[
                      'h-full min-w-0 flex-1 rounded-full transition-colors',
                      done || current ? 'bg-brand-orange' : 'bg-brand-border',
                      current ? 'ring-2 ring-brand-orange ring-offset-2 ring-offset-brand-cream' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                );
              })}
            </div>
          </div>
        </header>

        <div className="mt-14 sm:mt-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ x: direction * 48, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx jest SignupFlowShell.test --no-coverage
```

Expected: PASS (both tests green).

- [ ] **Step 5: Commit**

```bash
git add src/components/signup/SignupFlowShell.tsx src/components/signup/SignupFlowShell.test.tsx
git commit -m "feat: direction-aware step transitions in SignupFlowShell"
```

---

### Task 3: SendMoneyFlowShell — direction-aware step transition

**Files:**
- Modify: `src/components/transfer/SendMoneyFlowShell.tsx`

Same pattern as Task 2. The shell imports `transferStepFromPathname` from `@/lib/transfer-flow` instead.

- [ ] **Step 1: Rewrite SendMoneyFlowShell.tsx with AnimatePresence**

Replace the entire file content:

```tsx
'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TRANSFER_FLOW_TOTAL_STEPS,
  transferPreviousHref,
  transferStepFromPathname,
} from '@/lib/transfer-flow';

export function SendMoneyFlowShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/transfer';
  const step = transferStepFromPathname(pathname);
  const total = TRANSFER_FLOW_TOTAL_STEPS;
  const backHref = transferPreviousHref(pathname);

  const prevStepRef = useRef(step);
  const dirRef = useRef<1 | -1>(1);
  if (step !== prevStepRef.current) {
    dirRef.current = step > prevStepRef.current ? 1 : -1;
    prevStepRef.current = step;
  }
  const direction = dirRef.current;

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="mx-auto w-full max-w-2xl px-6 pb-20 pt-10 sm:px-10 lg:px-12">
        <header className="flex items-start justify-between gap-8">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 text-base font-medium text-brand-muted transition-colors hover:text-brand-orange"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back
          </Link>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <p className="text-base font-semibold tabular-nums text-brand-ink">
              {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            <div
              className="flex h-2 w-[12rem] gap-1.5 sm:w-[14rem]"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-label={`Step ${step} of ${total}`}
            >
              {Array.from({ length: total }, (_, i) => {
                const segmentStep = i + 1;
                const done = segmentStep < step;
                const current = segmentStep === step;
                return (
                  <span
                    key={i}
                    className={[
                      'h-full min-w-0 flex-1 rounded-full transition-colors',
                      done || current ? 'bg-brand-orange' : 'bg-brand-border',
                      current ? 'ring-2 ring-brand-orange ring-offset-2 ring-offset-brand-cream' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                );
              })}
            </div>
          </div>
        </header>

        <div className="mt-14 sm:mt-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ x: direction * 48, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run full test suite to confirm nothing broke**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/transfer/SendMoneyFlowShell.tsx
git commit -m "feat: direction-aware step transitions in SendMoneyFlowShell"
```

---

### Task 4: SchoolEmailStepForm — field stagger + check icon + validation messages

**Files:**
- Modify: `src/components/signup/SchoolEmailStepForm.tsx`

**Stagger index map:**
- i=0: heading + subtitle block
- i=1: email field group
- i=2: "or continue with" divider
- i=3: social buttons grid

The check icon and validation text within the email field group are wrapped in `AnimatePresence` for inline state changes. They are NOT in the stagger — they respond to user input at any time.

- [ ] **Step 1: Rewrite SchoolEmailStepForm.tsx**

Replace the entire file content:

```tsx
'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

function fieldVariant(i: number) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.06 } },
  };
}

const msgVariants = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

export function SchoolEmailStepForm() {
  const emailId = useId();

  const [email, setEmail] = useState('');

  const emailOk = useMemo(() => isValidEmail(email), [email]);

  const continueClassName =
    'flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange text-lg font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.45)] transition hover:bg-brand-orangeHover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45';

  return (
    <div>
      <motion.div {...fieldVariant(0)}>
        <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
          What&apos;s your email?
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
          We&apos;ll use it for transfer updates and your student rate — 1% flat, no spread.
        </p>
      </motion.div>

      <div className="mt-8 space-y-5">
        <motion.div {...fieldVariant(1)}>
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
            <AnimatePresence>
              {emailOk && (
                <motion.span
                  key="check-icon"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.15 } }}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <CheckIcon className="h-7 w-7" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            {emailOk ? (
              <motion.p
                key="email-ok"
                {...msgVariants}
                className="mt-2 flex items-center gap-2 text-base font-medium text-brand-success"
              >
                <span aria-hidden>✓</span>
                Valid email · you&apos;re eligible for student rates
              </motion.p>
            ) : email.trim().length > 0 ? (
              <motion.p key="email-error" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Please enter a valid email address.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <motion.div {...fieldVariant(2)}>
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
        </motion.div>
      </div>

      <motion.div {...fieldVariant(3)} className="mt-8 flex items-center gap-5">
        <div className="h-px flex-1 bg-brand-border" />
        <span className="shrink-0 text-sm font-medium uppercase tracking-wider text-brand-muted">
          or continue with
        </span>
        <div className="h-px flex-1 bg-brand-border" />
      </motion.div>

      <motion.div {...fieldVariant(4)} className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl border border-brand-border bg-white text-base font-semibold text-brand-ink transition hover:border-brand-borderDeep hover:bg-brand-cream/50"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Run tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass (existing NavBar and SignupFlowShell tests unaffected).

- [ ] **Step 3: Commit**

```bash
git add src/components/signup/SchoolEmailStepForm.tsx
git commit -m "feat: stagger and state animations in SchoolEmailStepForm"
```

---

### Task 5: PersonalInfoStepForm — field stagger + validation messages

**Files:**
- Modify: `src/components/signup/PersonalInfoStepForm.tsx`

**Stagger index map:**
- i=0: heading + subtitle block
- i=1: name grid (first + last as one unit — they share a grid row)
- i=2: phone field
- i=3: password field
- i=4: confirm password field
- i=5: CTA button

- [ ] **Step 1: Rewrite PersonalInfoStepForm.tsx**

Replace the entire file content:

```tsx
'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

function fieldVariant(i: number) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.06 } },
  };
}

const msgVariants = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

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

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const passwordWeak = password.length > 0 && !passwordStrongEnough(password);

  return (
    <div>
      <motion.div {...fieldVariant(0)}>
        <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
          Tell us about you
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
          Create your account with a few details — you&apos;ll use this to sign in and track transfers.
        </p>
      </motion.div>

      <div className="mt-8 space-y-4">
        <motion.div {...fieldVariant(1)} className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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
        </motion.div>

        <motion.div {...fieldVariant(2)}>
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
          <AnimatePresence>
            {phone.length > 0 && !phoneLooksValid(phone) && (
              <motion.p key="phone-error" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Enter a number with at least 10 digits.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...fieldVariant(3)}>
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
          <AnimatePresence>
            {passwordWeak && (
              <motion.p key="password-error" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Use at least 8 characters.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...fieldVariant(4)}>
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
          <AnimatePresence>
            {passwordMismatch && (
              <motion.p key="confirm-error" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Passwords don&apos;t match.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...fieldVariant(5)}>
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
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/signup/PersonalInfoStepForm.tsx
git commit -m "feat: stagger and validation animations in PersonalInfoStepForm"
```

---

### Task 6: IdentityVerificationStepForm — field stagger + validation messages

**Files:**
- Modify: `src/components/signup/IdentityVerificationStepForm.tsx`

**Stagger index map:**
- i=0: heading + subtitle block
- i=1: country select
- i=2: national ID field
- i=3: date of birth field
- i=4: CTA button

- [ ] **Step 1: Add motion imports and wrap fields**

At the top of the file, add the import:
```tsx
import { AnimatePresence, motion } from 'framer-motion';
```

Add these two helpers after the existing constants (after `SELECT_CHEVRON`):
```tsx
function fieldVariant(i: number) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.06 } },
  };
}

const msgVariants = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};
```

- [ ] **Step 2: Wrap the return JSX**

Replace the `return (` block (lines 73–163) with:

```tsx
  return (
    <div>
      <motion.div {...fieldVariant(0)}>
        <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
          Verify your identity
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
          We need a few details to meet regulatory requirements and keep your account secure.
        </p>
      </motion.div>

      <div className="mt-8 space-y-4">
        <motion.div {...fieldVariant(1)}>
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
        </motion.div>

        <motion.div {...fieldVariant(2)}>
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
          <AnimatePresence mode="wait">
            {nationalIdTouched && !nationalIdOk ? (
              <motion.p key="nid-error" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Enter at least 5 characters.
              </motion.p>
            ) : (
              <motion.p key="nid-hint" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Government-issued ID for your country (numbers and letters as shown on the document).
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...fieldVariant(3)}>
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
          <AnimatePresence>
            {dobInFuture && (
              <motion.p key="dob-future" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Date cannot be in the future.
              </motion.p>
            )}
            {ageTooYoung && (
              <motion.p key="dob-age" {...msgVariants} className="mt-2 text-base text-brand-muted">
                You must be at least 18 years old.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...fieldVariant(4)}>
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
        </motion.div>
      </div>
    </div>
  );
```

- [ ] **Step 3: Run tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/signup/IdentityVerificationStepForm.tsx
git commit -m "feat: stagger and validation animations in IdentityVerificationStepForm"
```

---

### Task 7: AccountCreatedStep — mount stagger

**Files:**
- Modify: `src/components/signup/AccountCreatedStep.tsx`

This component currently has no `'use client'` directive. Adding `motion` components requires it.

- [ ] **Step 1: Rewrite AccountCreatedStep.tsx**

Replace the entire file content:

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function mountVariant(i: number) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.24, delay: i * 0.06 } },
  };
}

export function AccountCreatedStep() {
  return (
    <div>
      <motion.h1
        {...mountVariant(0)}
        className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight"
      >
        Your account is ready!
      </motion.h1>
      <motion.p {...mountVariant(1)} className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
        You&apos;re all set. Open your dashboard anytime, or continue to complete your exchange.
      </motion.p>

      <motion.div {...mountVariant(2)} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
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
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Run tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/signup/AccountCreatedStep.tsx
git commit -m "feat: mount stagger in AccountCreatedStep"
```

---

### Task 8: UsBankInformationStepForm — field stagger + validation messages

**Files:**
- Modify: `src/components/transfer/UsBankInformationStepForm.tsx`

**Stagger index map:**
- i=0: heading + subtitle block
- i=1: account holder name field
- i=2: bank name field
- i=3: routing number field
- i=4: account number field
- i=5: CTA button

- [ ] **Step 1: Rewrite UsBankInformationStepForm.tsx**

Replace the entire file content:

```tsx
'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

function fieldVariant(i: number) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.06 } },
  };
}

const msgVariants = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

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
      <motion.div {...fieldVariant(0)}>
        <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
          US bank information
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
          Add the US account that will receive your exchange. Use the name exactly as it appears on the account.
        </p>
      </motion.div>

      <div className="mt-8 space-y-4">
        <motion.div {...fieldVariant(1)}>
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
        </motion.div>

        <motion.div {...fieldVariant(2)}>
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
        </motion.div>

        <motion.div {...fieldVariant(3)}>
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
          <AnimatePresence>
            {routingInvalid && (
              <motion.p key="routing-error" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Enter a valid 9-digit routing number.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...fieldVariant(4)}>
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
          <AnimatePresence>
            {accountInvalid && (
              <motion.p key="account-error" {...msgVariants} className="mt-2 text-base text-brand-muted">
                Use 4–17 digits.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...fieldVariant(5)}>
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
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/transfer/UsBankInformationStepForm.tsx
git commit -m "feat: stagger and validation animations in UsBankInformationStepForm"
```

---

### Task 9: PixPaymentStep — panel stagger

**Files:**
- Modify: `src/components/transfer/PixPaymentStep.tsx`

**Stagger index map:**
- i=0: heading + subtitle block
- i=1: timer panel
- i=2: payment details + QR code panel
- i=3: transaction progress panel
- i=4: how it works panel
- i=5: back link footer

- [ ] **Step 1: Add import and helpers**

Add this import at the top of the file (after existing imports):
```tsx
import { motion } from 'framer-motion';
```

Add this helper function before the `PixPaymentStep` component definition:
```tsx
function panelVariant(i: number) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.06 } },
  };
}
```

- [ ] **Step 2: Wrap content sections**

Replace the `return (` block with:

```tsx
  return (
    <div className="space-y-8">
      <motion.div {...panelVariant(0)}>
        <h1 className="font-body text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl sm:leading-tight">
          PIX Payment — Brazil
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-muted sm:text-xl">
          Complete your payment using PIX to fund your money transfer.
        </p>
      </motion.div>

      {/* Timer */}
      <motion.div
        {...panelVariant(1)}
        className={`${panelClass} flex flex-row items-center justify-between gap-4 sm:gap-8`}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand-ink">Quote expires in:</p>
          <p className="mt-1 text-sm text-brand-muted">Complete payment before timer expires</p>
        </div>
        <p
          className="shrink-0 font-body text-4xl font-semibold tabular-nums tracking-tight text-brand-orange sm:text-5xl"
          aria-live="polite"
        >
          {secondsLeft > 0 ? formatCountdown(secondsLeft) : '0:00'}
        </p>
      </motion.div>

      <motion.div {...panelVariant(2)} className={panelClass}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div>
            <h2 className="font-body text-lg font-semibold text-brand-ink">Payment details</h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className={labelClass}>Amount to pay</dt>
                <dd className={valueClass}>{PIX_TRANSFER_DEMO.amountBrl} BRL</dd>
              </div>
              <div>
                <dt className={labelClass}>USD amount</dt>
                <dd className={valueClass}>${PIX_TRANSFER_DEMO.amountUsd}</dd>
              </div>
              <div>
                <dt className={labelClass}>Exchange rate</dt>
                <dd className={valueClass}>{PIX_TRANSFER_DEMO.rateLabel}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="font-body text-lg font-semibold text-brand-ink">PIX QR code</h2>
            <button
              type="button"
              onClick={() => router.push('/transfer/confirm')}
              className="relative mt-6 flex aspect-square w-full max-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand-border bg-white p-4 text-left transition hover:border-brand-orange/60 hover:ring-2 hover:ring-brand-orange/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
              aria-label="Simulate PIX payment: tap to continue to confirmation"
            >
              <Image
                src="/qrcode-mock.svg"
                alt=""
                width={285}
                height={285}
                className="h-auto w-full max-h-[220px] object-contain pointer-events-none"
              />
            </button>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              Tap the QR code to simulate payment and continue (demo).
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div {...panelVariant(3)} className={panelClass}>
        <h2 className="font-body text-lg font-semibold text-brand-ink">Transaction progress</h2>
        <div className="mt-4 flex items-start gap-3">
          <span
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400 ring-2 ring-amber-400/30"
            aria-hidden
          />
          <div>
            <p className="font-semibold text-brand-ink">PIX payment</p>
            <p className="mt-1 text-sm text-brand-muted">Waiting for PIX payment confirmation</p>
          </div>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div {...panelVariant(4)} className={panelClass}>
        <h2 className="font-body text-lg font-semibold text-brand-ink">How PIX payment works</h2>
        <ol className="mt-6 space-y-5">
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cream text-sm font-bold text-brand-orange">
              1
            </span>
            <div>
              <p className="font-semibold text-brand-ink">Scan QR code</p>
              <p className="mt-1 text-sm text-brand-muted">Use your banking app to scan the PIX QR code.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cream text-sm font-bold text-brand-orange">
              2
            </span>
            <div>
              <p className="font-semibold text-brand-ink">Confirm payment</p>
              <p className="mt-1 text-sm text-brand-muted">Verify the amount and complete the PIX transfer.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cream text-sm font-bold text-brand-orange">
              3
            </span>
            <div>
              <p className="font-semibold text-brand-ink">Instant processing</p>
              <p className="mt-1 text-sm text-brand-muted">Your payment is processed immediately.</p>
            </div>
          </li>
        </ol>
      </motion.div>

      <motion.div {...panelVariant(5)} className="border-t border-brand-border pt-8">
        <Link
          href="/transfer/transaction"
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl border-2 border-brand-borderDeep bg-white px-8 text-base font-semibold text-brand-ink transition hover:border-brand-ink/25 hover:bg-brand-cream sm:w-auto"
        >
          Back to quote
        </Link>
        <p className="mt-6 text-left text-sm text-brand-muted">
          Tap the QR code to continue to confirmation (demo). Use Back to quote to change the amount.
        </p>
      </motion.div>
    </div>
  );
```

- [ ] **Step 3: Run tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/transfer/PixPaymentStep.tsx
git commit -m "feat: panel stagger in PixPaymentStep"
```

---

### Task 10: TransferConfirmPage — checkmark spring + summary panel reveal

**Files:**
- Modify: `src/app/transfer/confirm/page.tsx`

- [ ] **Step 1: Add import**

Add this import at the top of `src/app/transfer/confirm/page.tsx` (after the existing imports):
```tsx
import { motion } from 'framer-motion';
```

- [ ] **Step 2: Animate the checkmark circle**

In the `return (` block, find this span (the orange checkmark circle):
```tsx
<span
  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_3px_10px_-3px_rgba(244,106,53,0.5)] sm:h-9 sm:w-9"
  aria-hidden
>
```

Replace it with:
```tsx
<motion.span
  initial={{ scale: 0 }}
  animate={{ scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_3px_10px_-3px_rgba(244,106,53,0.5)] sm:h-9 sm:w-9"
  aria-hidden
>
```

Close tag changes from `</span>` to `</motion.span>`.

- [ ] **Step 3: Animate the summary panel**

Find:
```tsx
<div className={`${panelClass} mt-10`}>
```

Replace with:
```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0, transition: { duration: 0.22, delay: 0.08 } }}
  className={`${panelClass} mt-10`}
>
```

And its closing `</div>` becomes `</motion.div>`.

- [ ] **Step 4: Run tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/transfer/confirm/page.tsx
git commit -m "feat: checkmark spring and panel reveal in TransferConfirmPage"
```

---

### Task 11: Visual verification

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Walk the signup flow**

Open `http://localhost:3000/signup` and verify:
- Fields stagger in on initial render (opacity + y rise, 60ms apart)
- Typing a valid email shows the check icon with a scale pop-in
- Typing an invalid email shows/hides the error message with a fade
- Clicking Continue slides the next step in from the right (slide-fade)
- Clicking Back slides the previous step in from the left

- [ ] **Step 3: Walk the transfer flow**

Open `http://localhost:3000/transfer` and verify:
- Bank information fields stagger in
- Validation errors fade in/out on blur
- PIX payment step panels stagger in sequentially
- Tapping the QR code navigates to confirm, which shows the spring checkmark then the summary panel fading up
- Clicking Back in any step slides the previous step in from the left

- [ ] **Step 4: Final test run**

```bash
npx jest --no-coverage
```

Expected: all tests pass. No console errors from framer-motion.
