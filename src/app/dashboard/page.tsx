import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 bg-brand-cream px-6 py-16 text-center">
      <h1 className="font-display text-3xl text-brand-dark">Dashboard</h1>
      <p className="text-brand-muted">This area will show your account overview and activity.</p>
      <Link
        href="/"
        className="text-sm font-semibold text-brand-orange hover:text-brand-orangeHover"
      >
        ← Back to home
      </Link>
    </div>
  );
}
