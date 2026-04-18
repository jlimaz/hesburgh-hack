'use client';

import Image from 'next/image';
import Link from 'next/link';

export function NavBar() {
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

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-brand-ink/90 transition-colors hover:bg-white/15 hover:text-brand-ink sm:px-4"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(244,106,53,0.55)] transition-colors hover:bg-brand-orangeHover active:translate-y-px sm:px-5"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
