import type { ReactNode } from 'react';

import { NavBarProfile } from '@/components/layout/NavBarProfile';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <NavBarProfile />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <main className="py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
