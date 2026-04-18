# Sype Foundation — Design Spec
*2026-04-18*

## Overview
Scaffold the Sype fintech platform: a Next.js App Router project with Tailwind CSS, Flowbite React, and Zustand. Delivers the brand design system, a responsive NavBar, a Flowbite Stepper for the 4-step signup wizard, and the flat Zustand store.

---

## Section 1 — Project Scaffold & Config

- **Framework:** Next.js (App Router, TypeScript), scaffolded via `create-next-app`
- **Styling:** Tailwind CSS (included in scaffold)
- **Component library:** `flowbite` + `flowbite-react`
- **State:** `zustand`

### Tailwind config additions (`tailwind.config.ts`)
```ts
content: [
  // ... default Next.js entries
  "./node_modules/flowbite-react/lib/**/*.js",
],
plugins: [require("flowbite/plugin")],
theme: {
  extend: {
    colors: {
      brand: {
        orange:      "#F46A35",
        orangeHover: "#D85A28",
        cream:       "#F7F5EE",
        dark:        "#1A1A1A",
        muted:       "#6B7280",
        border:      "#E5E0D8",
        success:     "#2D6A4F",
      },
    },
  },
},
```

### Fonts (`src/app/layout.tsx`)
Load via `next/font/google`:
- `DM_Serif_Display` weight 400 — CSS variable `--font-display`
- `Inter` weights 400, 500, 600 — CSS variable `--font-body`

Apply both variables on `<html>`. Use `font-[family-name:var(--font-body)]` as the default body font.

---

## Section 2 — NavBar (`src/components/layout/NavBar.tsx`)

Uses Flowbite React `Navbar` as the shell.

**Structure:**
- Outer wrapper: `sticky top-0 z-50 bg-white border-b border-brand-border`
- `Navbar.Brand`: `<img src="/full-logo.svg" alt="Sype" className="h-8" />`
- `Navbar.Toggle`: Flowbite hamburger for mobile collapse
- `Navbar.Collapse`:
  - Nav links: "How it works", "Schools", "Pricing", "Help"
    - Style: `text-sm text-gray-600 hover:text-brand-orange transition-colors`
  - "Log in" Button: `color="light"`, `pill={true}`
  - "Sign up" Button: `pill={true}`, `className="bg-brand-orange text-white hover:bg-brand-orangeHover"`

**Responsive behavior:** On mobile, nav links and both buttons collapse behind the hamburger toggle. On desktop, they render inline right-aligned.

---

## Section 3 — StepIndicator (`src/components/ui/StepIndicator.tsx`)

Uses Flowbite React `Stepper` component.

**Props:** `currentStep: number` (1–4)

**Steps:**
| # | Label | Fields covered |
|---|-------|----------------|
| 1 | Personal | firstName, lastName, email, nationality, dateOfBirth |
| 2 | University | universityName, studentId, enrollmentYear, program |
| 3 | Banking | bankCountry, bankName, accountNumber, swiftCode |
| 4 | Address | streetAddress, addressLine2, city, state, zip, housingType, isMailingAddress |

Each `Stepper.Step` receives active/completed state derived from `currentStep`. Purely presentational — no internal state.

---

## Section 4 — Zustand Store (`src/store/signupStore.ts`)

**Approach:** Flat monolithic store (Option A). All fields top-level. In-memory only — no `persist` middleware.

**State shape:**
```ts
interface SignupState {
  // Step 1 — Personal
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  dateOfBirth: string;

  // Step 2 — University
  universityName: string;
  studentId: string;
  enrollmentYear: number;
  program: string;

  // Step 3 — Banking
  bankCountry: string;
  bankName: string;
  accountNumber: string;
  swiftCode: string;

  // Step 4 — Address
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  housingType: string;
  isMailingAddress: boolean;

  // Navigation
  currentStep: number;

  // Actions
  setField: (field: keyof Omit<SignupState, 'setField' | 'setStep'>, value: string | number | boolean) => void;
  setStep: (step: number) => void;
}
```

**Initialization:** All string fields `""`, `enrollmentYear` → `0`, `isMailingAddress` → `false`, `currentStep` → `1`.

---

## Files to Create

| Path | Description |
|------|-------------|
| `tailwind.config.ts` | Brand tokens + Flowbite plugin |
| `src/app/layout.tsx` | Google Fonts setup |
| `src/components/layout/NavBar.tsx` | Responsive nav |
| `src/components/ui/StepIndicator.tsx` | Flowbite Stepper wrapper |
| `src/store/signupStore.ts` | Flat Zustand store |
| `public/full-logo.svg` | Drop-in by user |
| `public/icon.svg` | Drop-in by user |
