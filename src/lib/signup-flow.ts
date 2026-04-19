/** Ordered signup URLs within the shell (back/forward navigation). */
export const SIGNUP_STEP_PATHS: string[] = [
  '/signup',
  '/signup/personal',
  '/signup/identity',
  '/signup/complete',
];

/** Total steps in the signup shell progress indicator (keeps count aligned with routes). */
export const SIGNUP_FLOW_TOTAL_STEPS = SIGNUP_STEP_PATHS.length;

/** 1-based step index shown in the header for each signup route. */
const SIGNUP_PATH_TO_STEP: Record<string, number> = {
  '/signup': 1,
  '/signup/personal': 2,
  '/signup/identity': 3,
  '/signup/complete': 4,
};

function normalizePath(pathname: string): string {
  const p = pathname.replace(/\/$/, '') || '/';
  return p;
}

/** Current step (1-based) for the progress indicator */
export function signupStepFromPathname(pathname: string): number {
  const n = normalizePath(pathname);
  return SIGNUP_PATH_TO_STEP[n] ?? 1;
}

/** Previous URL in the signup flow, or home when on the first step */
export function signupPreviousHref(pathname: string): string {
  const n = normalizePath(pathname);
  const i = SIGNUP_STEP_PATHS.indexOf(n);
  if (i <= 0) return '/';
  return SIGNUP_STEP_PATHS[i - 1]!;
}
