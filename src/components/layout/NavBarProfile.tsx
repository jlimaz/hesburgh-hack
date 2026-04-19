'use client';

import Image from 'next/image';
import Link from 'next/link';

export type NavBarProfileProps = {
  /** Display name used to derive two-letter initials */
  userName?: string;
  /** Destination for the profile avatar */
  profileHref?: string;
};

function getInitials(name: string): string {
  const t = name.trim();
  if (!t) return '?';
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]![0];
    const b = parts[parts.length - 1]![0];
    return `${a}${b}`.toUpperCase().slice(0, 2);
  }
  return t.slice(0, 2).toUpperCase();
}

export function NavBarProfile({
  userName = 'Gabriel',
  profileHref = '/dashboard/settings',
}: NavBarProfileProps) {
  const initials = getInitials(userName);

  return (
    <header className="sticky top-0 z-50 w-full pt-4 pb-2 sm:pt-5">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <nav
          className="flex w-full items-center justify-between gap-4 rounded-[1.625rem] border border-brand-ink/[0.018] bg-brand-ink/[0.01] px-4 py-2.5 shadow-[0_12px_24px_-14px_rgba(26,26,26,0.28)] backdrop-blur-md sm:rounded-[1.875rem] sm:px-6 sm:py-3"
          aria-label="Main"
        >
          <Link
            href="/"
            className="flex shrink-0 items-center outline-none ring-brand-orange/40 transition-opacity hover:opacity-90 focus-visible:ring-2"
          >
            <Image
              src="/full-logo.svg"
              alt="Sype"
              width={120}
              height={42}
              className="h-7 w-auto sm:h-8"
              priority
            />
          </Link>

          <Link
            href={profileHref}
            title="Account settings"
            aria-label="Account settings"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-cream/80 text-sm font-semibold text-brand-ink ring-1 ring-brand-borderDeep/60 transition-colors hover:bg-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 sm:h-10 sm:w-10"
          >
            <span aria-hidden>{initials}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
