/** Send-money flow after signup: ordered URLs for back/forward and the step indicator. */
export const TRANSFER_STEP_PATHS: string[] = [
  '/transfer',
  '/transfer/transaction',
  '/transfer/payment',
  '/transfer/confirm',
];

export const TRANSFER_FLOW_TOTAL_STEPS = TRANSFER_STEP_PATHS.length;

const TRANSFER_PATH_TO_STEP: Record<string, number> = {
  '/transfer': 1,
  '/transfer/transaction': 2,
  '/transfer/payment': 3,
  '/transfer/confirm': 4,
};

function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, '') || '/';
}

export function transferStepFromPathname(pathname: string): number {
  const n = normalizePath(pathname);
  return TRANSFER_PATH_TO_STEP[n] ?? 1;
}

/** Previous URL in the transfer flow, or signup completion when on the first step. */
export function transferPreviousHref(pathname: string): string {
  const n = normalizePath(pathname);
  const i = TRANSFER_STEP_PATHS.indexOf(n);
  if (i <= 0) return '/signup/complete';
  return TRANSFER_STEP_PATHS[i - 1]!;
}
