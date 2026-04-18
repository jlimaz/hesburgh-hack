# Sype Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Sype Next.js project with brand design system, responsive NavBar, Flowbite-styled stepper, and flat Zustand signup store.

**Architecture:** Fresh Next.js App Router project with Tailwind CSS v3, Flowbite (CSS + flowbite-react), and Zustand. Components are server-safe by default; NavBar and StepIndicator are `'use client'`. Zustand store is in-memory with no persistence. The stepper uses Flowbite's HTML/CSS pattern implemented as a React component (no React wrapper exists for Flowbite Stepper yet).

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v3, flowbite + flowbite-react, Zustand, Jest + React Testing Library

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `tailwind.config.ts` | Modify | Brand tokens + Flowbite content/plugin |
| `src/app/layout.tsx` | Modify | Google Fonts (DM Serif Display + Inter) |
| `jest.config.ts` | Create | Next.js Jest configuration |
| `jest.setup.ts` | Create | @testing-library/jest-dom setup |
| `src/store/signupStore.ts` | Create | Flat Zustand signup state |
| `src/store/signupStore.test.ts` | Create | Store unit tests |
| `src/components/ui/StepIndicator.tsx` | Create | Flowbite-styled 4-step progress stepper |
| `src/components/ui/StepIndicator.test.tsx` | Create | Stepper render tests |
| `src/components/layout/NavBar.tsx` | Create | Sticky responsive navbar |
| `src/components/layout/NavBar.test.tsx` | Create | NavBar render tests |
| `public/full-logo.svg` | User drop-in | Sype full logo |
| `public/icon.svg` | User drop-in | Sype icon |

---

### Task 1: Scaffold Next.js project

**Files:**
- Creates entire project structure

- [ ] **Step 1: Scaffold with create-next-app**

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*"
```

When prompted interactively: TypeScript ✓, Tailwind ✓, App Router ✓, `src/` dir ✓, no ESLint, import alias `@/*`.

- [ ] **Step 2: Verify Tailwind v3 (Flowbite requires v3)**

```bash
cat node_modules/tailwindcss/package.json | grep '"version"'
```

Expected: `"version": "3.x.x"`. If it shows `4.x.x`, run:

```bash
npm install tailwindcss@3 postcss autoprefixer
```

- [ ] **Step 3: Copy SVG assets into public/**

Place `full-logo.svg` and `icon.svg` into `public/`. Verify:

```bash
ls public/full-logo.svg public/icon.svg
```

- [ ] **Step 4: Initial commit**

```bash
git add .
git commit -m "chore: scaffold Next.js project"
```

---

### Task 2: Install dependencies and configure Jest

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install flowbite flowbite-react zustand
```

- [ ] **Step 2: Install testing dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest
```

- [ ] **Step 3: Create jest.config.ts**

```ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(config);
```

- [ ] **Step 4: Create jest.setup.ts**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Add test scripts to package.json**

In `package.json` under `"scripts"`, add:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 6: Verify Jest runs**

```bash
npm test -- --passWithNoTests
```

Expected: `Test Suites: 0 passed, 0 total` with no failures.

- [ ] **Step 7: Commit**

```bash
git add jest.config.ts jest.setup.ts package.json package-lock.json
git commit -m "chore: install deps and configure Jest"
```

---

### Task 3: Configure Tailwind with brand tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/lib/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:      '#F46A35',
          orangeHover: '#D85A28',
          cream:       '#F7F5EE',
          dark:        '#1A1A1A',
          muted:       '#6B7280',
          border:      '#E5E0D8',
          success:     '#2D6A4F',
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};

export default config;
```

- [ ] **Step 2: Verify build compiles**

```bash
npm run build
```

Expected: build succeeds with no Tailwind errors.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: add brand design tokens and Flowbite plugin"
```

---

### Task 4: Configure Google Fonts in layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace src/app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import { DM_Serif_Display, Inter } from 'next/font/google';
import './globals.css';

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Sype',
  description: 'Pay US university tuition in your home currency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${inter.variable}`}>
      <body className="font-[family-name:var(--font-body)] bg-brand-cream text-brand-dark">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify dev server loads fonts**

```bash
npm run dev
```

Open http://localhost:3000. Expected: page loads with Inter applied to body text.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configure DM Serif Display and Inter fonts"
```

---

### Task 5: Implement Zustand signup store (TDD)

**Files:**
- Create: `src/store/signupStore.ts`
- Create: `src/store/signupStore.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/store/signupStore.test.ts`:

```ts
import { useSignupStore } from './signupStore';

const initialState = {
  firstName: '', lastName: '', email: '', nationality: '', dateOfBirth: '',
  universityName: '', studentId: '', enrollmentYear: 0, program: '',
  bankCountry: '', bankName: '', accountNumber: '', swiftCode: '',
  streetAddress: '', addressLine2: '', city: '', state: '', zip: '',
  housingType: '', isMailingAddress: false,
  currentStep: 1,
};

beforeEach(() => {
  useSignupStore.setState(initialState);
});

describe('useSignupStore', () => {
  it('initializes with currentStep 1', () => {
    expect(useSignupStore.getState().currentStep).toBe(1);
  });

  it('initializes all string fields as empty string', () => {
    const state = useSignupStore.getState();
    expect(state.firstName).toBe('');
    expect(state.email).toBe('');
    expect(state.swiftCode).toBe('');
  });

  it('initializes enrollmentYear as 0', () => {
    expect(useSignupStore.getState().enrollmentYear).toBe(0);
  });

  it('initializes isMailingAddress as false', () => {
    expect(useSignupStore.getState().isMailingAddress).toBe(false);
  });

  it('setField updates a string field', () => {
    useSignupStore.getState().setField('firstName', 'Alice');
    expect(useSignupStore.getState().firstName).toBe('Alice');
  });

  it('setField updates a number field', () => {
    useSignupStore.getState().setField('enrollmentYear', 2023);
    expect(useSignupStore.getState().enrollmentYear).toBe(2023);
  });

  it('setField updates a boolean field', () => {
    useSignupStore.getState().setField('isMailingAddress', true);
    expect(useSignupStore.getState().isMailingAddress).toBe(true);
  });

  it('setStep updates currentStep', () => {
    useSignupStore.getState().setStep(3);
    expect(useSignupStore.getState().currentStep).toBe(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/store/signupStore.test.ts
```

Expected: `Cannot find module './signupStore'`

- [ ] **Step 3: Create src/store/signupStore.ts**

```ts
import { create } from 'zustand';

interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  dateOfBirth: string;
  universityName: string;
  studentId: string;
  enrollmentYear: number;
  program: string;
  bankCountry: string;
  bankName: string;
  accountNumber: string;
  swiftCode: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  housingType: string;
  isMailingAddress: boolean;
  currentStep: number;
  setField: (
    field: keyof Omit<SignupState, 'setField' | 'setStep'>,
    value: string | number | boolean,
  ) => void;
  setStep: (step: number) => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  firstName: '',
  lastName: '',
  email: '',
  nationality: '',
  dateOfBirth: '',
  universityName: '',
  studentId: '',
  enrollmentYear: 0,
  program: '',
  bankCountry: '',
  bankName: '',
  accountNumber: '',
  swiftCode: '',
  streetAddress: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  housingType: '',
  isMailingAddress: false,
  currentStep: 1,
  setField: (field, value) => set({ [field]: value }),
  setStep: (step) => set({ currentStep: step }),
}));
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test src/store/signupStore.test.ts
```

Expected: `8 passed, 8 total`

- [ ] **Step 5: Commit**

```bash
git add src/store/signupStore.ts src/store/signupStore.test.ts
git commit -m "feat: add flat Zustand signup store"
```

---

### Task 6: Implement StepIndicator (TDD)

**Files:**
- Create: `src/components/ui/StepIndicator.tsx`
- Create: `src/components/ui/StepIndicator.test.tsx`

Uses the Flowbite horizontal stepper HTML pattern (https://flowbite.com/docs/components/stepper/) implemented as a React component — no flowbite-react wrapper exists for Stepper.

- [ ] **Step 1: Write failing tests**

Create `src/components/ui/StepIndicator.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { StepIndicator } from './StepIndicator';

describe('StepIndicator', () => {
  it('renders all 4 step labels', () => {
    render(<StepIndicator currentStep={1} />);
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('University')).toBeInTheDocument();
    expect(screen.getByText('Banking')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('shows step number for current and upcoming steps', () => {
    render(<StepIndicator currentStep={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('hides numbers for completed steps', () => {
    render(<StepIndicator currentStep={3} />);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('applies brand-orange color to completed and current steps', () => {
    const { container } = render(<StepIndicator currentStep={2} />);
    const items = container.querySelectorAll('li');
    expect(items[0].className).toContain('text-brand-orange');
    expect(items[1].className).toContain('text-brand-orange');
    expect(items[2].className).not.toContain('text-brand-orange');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/components/ui/StepIndicator.test.tsx
```

Expected: `Cannot find module './StepIndicator'`

- [ ] **Step 3: Create src/components/ui/StepIndicator.tsx**

```tsx
'use client';

interface Step {
  label: string;
  sub: string;
}

const STEPS: Step[] = [
  { label: 'Personal', sub: 'Info' },
  { label: 'University', sub: 'Details' },
  { label: 'Banking', sub: 'Info' },
  { label: 'Address', sub: 'Details' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isLast = stepNumber === STEPS.length;

        return (
          <li
            key={stepNumber}
            className={[
              'flex items-center',
              !isLast
                ? "md:w-full sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-brand-border after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10"
                : '',
              isCompleted || isCurrent ? 'text-brand-orange' : 'text-gray-500',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 whitespace-nowrap">
              {isCompleted ? (
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
              ) : (
                <span className="me-2">{stepNumber}</span>
              )}
              {step.label}
              <span className="hidden sm:inline-flex sm:ms-2">{step.sub}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test src/components/ui/StepIndicator.test.tsx
```

Expected: `4 passed, 4 total`

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/StepIndicator.tsx src/components/ui/StepIndicator.test.tsx
git commit -m "feat: add Flowbite-styled 4-step progress stepper"
```

---

### Task 7: Implement NavBar (TDD)

**Files:**
- Create: `src/components/layout/NavBar.tsx`
- Create: `src/components/layout/NavBar.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/layout/NavBar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('renders the Sype logo', () => {
    render(<NavBar />);
    expect(screen.getByAltText('Sype')).toBeInTheDocument();
  });

  it('renders all four nav links', () => {
    render(<NavBar />);
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Schools')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('renders Log in button', () => {
    render(<NavBar />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders Sign up button', () => {
    render(<NavBar />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('has sticky top-0 positioning on the outer wrapper', () => {
    const { container } = render(<NavBar />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('sticky');
    expect(wrapper.className).toContain('top-0');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/components/layout/NavBar.test.tsx
```

Expected: `Cannot find module './NavBar'`

- [ ] **Step 3: Create src/components/layout/NavBar.tsx**

```tsx
'use client';

import { Navbar, Button } from 'flowbite-react';

export function NavBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-brand-border bg-white">
      <Navbar fluid>
        <Navbar.Brand href="/">
          <img src="/full-logo.svg" alt="Sype" className="h-8" />
        </Navbar.Brand>
        <div className="flex items-center gap-2 md:order-2">
          <Button color="light" pill>
            Log in
          </Button>
          <Button
            pill
            className="bg-brand-orange text-white hover:bg-brand-orangeHover border-0"
          >
            Sign up
          </Button>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            How it works
          </Navbar.Link>
          <Navbar.Link href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Schools
          </Navbar.Link>
          <Navbar.Link href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Pricing
          </Navbar.Link>
          <Navbar.Link href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Help
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test src/components/layout/NavBar.test.tsx
```

Expected: `5 passed, 5 total`

- [ ] **Step 5: Run full test suite**

```bash
npm test
```

Expected: all test suites pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/NavBar.tsx src/components/layout/NavBar.test.tsx
git commit -m "feat: add responsive NavBar with Flowbite"
```
