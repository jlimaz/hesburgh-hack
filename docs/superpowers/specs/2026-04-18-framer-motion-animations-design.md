# Framer Motion Animations — Signup & Transfer Flows

**Date:** 2026-04-18  
**Status:** Approved

## Overview

Add purposeful Framer Motion animations to the signup and transfer flows across three categories: direction-aware step transitions, state change animations, and staggered form field reveals. All durations stay within 150–300ms. No decorative motion — every animation communicates state or guides attention.

Framer Motion is not currently installed and must be added as a dependency.

---

## 1. Step Transitions

**Files:** `SignupFlowShell.tsx`, `SendMoneyFlowShell.tsx`

Both shells already compute a step number from the current pathname via `signupStepFromPathname` / `transferStepFromPathname`. Direction is derived by comparing the current step to the previous one stored in a `useRef`.

```
direction = step > prevStep ? 1 : -1
```

`{children}` is wrapped in `<AnimatePresence mode="wait">` with a keyed `<motion.div key={pathname}>` inside.

Variants:
```ts
initial:  { x: direction * 48, opacity: 0 }
animate:  { x: 0, opacity: 1 }            // 220ms ease-out
exit:     { x: direction * -48, opacity: 0 } // 180ms ease-in
```

- Forward (Continue): new step enters from right, old step exits left.
- Backward (Back): new step enters from left, old step exits right.
- `mode="wait"` ensures the exit completes before the entrance begins, avoiding overlap.

---

## 2. State Change Animations

### Email check icon (`SchoolEmailStepForm`)
The green `CheckIcon` span is conditionally rendered when `emailOk` is true. Wrap it in `<AnimatePresence>` and animate with:
```ts
initial: { scale: 0.5, opacity: 0 }
animate: { scale: 1, opacity: 1 }   // 200ms ease-out
exit:    { scale: 0.5, opacity: 0 } // 150ms
```

### Validation and hint messages
All `{condition ? <p>…</p> : null}` patterns in form components are wrapped in `<AnimatePresence>`. Each `<p>` becomes a `<motion.p>`:
```ts
initial: { opacity: 0, y: -6 }
animate: { opacity: 1, y: 0 }   // 150ms ease-out
exit:    { opacity: 0, y: -6 }  // 120ms
```
Applies to: email validation text in `SchoolEmailStepForm`, routing/account error messages in `UsBankInformationStepForm`, DOB and age messages in `IdentityVerificationStepForm`.

### Account created (`AccountCreatedStep`)
Heading, subtitle, and CTA buttons stagger in on mount:
```ts
// shared helper
const mountVariant = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, delay: i * 0.06 } },
})
// heading → i=0, subtitle → i=1, buttons → i=2
```

### Transfer confirmed (`TransferConfirmPage`)
The orange checkmark circle gets a spring entry on mount:
```ts
initial: { scale: 0 }
animate: { scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
```
The transaction summary panel fades in 80ms after:
```ts
initial: { opacity: 0, y: 8 }
animate: { opacity: 1, y: 0, transition: { duration: 0.22, delay: 0.08 } }
```

---

## 3. Staggered Form Field Reveals

**Where:** `SchoolEmailStepForm`, `PersonalInfoStepForm`, `IdentityVerificationStepForm`, `UsBankInformationStepForm`, `PixPaymentStep`

**Shared helper:**
```ts
const fieldVariant = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.06 } },
})
```

Each top-level grouping div (label + input + helper text) becomes a `<motion.div>` with `{...fieldVariant(i)}`. The heading/subtitle group is index 0, leading the sequence. The CTA button is the last index, directing the eye toward the action.

With 4 fields (max), the last element enters at 240ms — within the 300ms ceiling.

**PixPaymentStep specifically:** The 4 panels (timer, payment details, progress tracker, how-it-works) stagger at 60ms intervals. This is the most content-heavy step; stagger helps the user parse the hierarchy without being overwhelmed.

---

## Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add `framer-motion` |
| `SignupFlowShell.tsx` | Direction-aware `AnimatePresence` wrapping `{children}` |
| `SendMoneyFlowShell.tsx` | Same as above |
| `SchoolEmailStepForm.tsx` | Stagger fields + check icon animation + validation message animations |
| `PersonalInfoStepForm.tsx` | Stagger fields |
| `IdentityVerificationStepForm.tsx` | Stagger fields + validation message animations |
| `UsBankInformationStepForm.tsx` | Stagger fields + validation message animations |
| `AccountCreatedStep.tsx` | Mount stagger on heading, subtitle, buttons |
| `PixPaymentStep.tsx` | Panel stagger |
| `app/transfer/confirm/page.tsx` | Checkmark spring + panel fade |

No new files. No routing, business logic, or styling changes.

---

## Constraints

- All durations: 150–300ms.
- No animation runs purely for aesthetics — each targets a state change or guides reading order.
- `AnimatePresence` is used only where elements genuinely enter and exit the DOM.
- The `fieldVariant` helper is defined once per file (not a shared module) to keep each component self-contained and avoid cross-file coupling.
