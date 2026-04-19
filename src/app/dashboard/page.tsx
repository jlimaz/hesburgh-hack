'use client';

import {
  ArrowUpRightIcon,
  BanknotesIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type CurrencyTab = 'USD' | 'EUR' | 'GBP' | 'CAD';
type Status = 'Completed' | 'Pending';
type TxnType = 'Transfer' | 'Inbound';

type Txn = {
  id: string;
  type: TxnType;
  date: string;
  recipient: string;
  amount: number;
  currency: CurrencyTab;
  status: Status;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function formatMoney(amount: number, currency: CurrencyTab) {
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

const DISPLAY_CURRENCY: CurrencyTab = 'USD';

const DEMO_TXNS: Txn[] = [
  {
    id: '019bc846a1b2c3d4',
    type: 'Transfer',
    date: 'Jan 16, 2026',
    recipient: 'Alice Brown',
    amount: 27.6,
    currency: 'USD',
    status: 'Completed',
  },
  {
    id: '019bc846a1b2c3d5',
    type: 'Inbound',
    date: 'Jan 18, 2026',
    recipient: 'Bob Smith',
    amount: 15,
    currency: 'USD',
    status: 'Completed',
  },
  {
    id: '019bc846a1b2c3d6',
    type: 'Inbound',
    date: 'Jan 21, 2026',
    recipient: 'ABC Corp',
    amount: 50,
    currency: 'USD',
    status: 'Completed',
  },
  {
    id: '019bc846a1b2c3d7',
    type: 'Transfer',
    date: 'Jan 21, 2026',
    recipient: 'Alice Brown',
    amount: 27.6,
    currency: 'USD',
    status: 'Completed',
  },
  {
    id: '019bc846a1b2c3d8',
    type: 'Inbound',
    date: 'Jan 21, 2026',
    recipient: 'ABC Corp',
    amount: 15,
    currency: 'USD',
    status: 'Completed',
  },
  {
    id: '019bc846a1b2c3d9',
    type: 'Transfer',
    date: 'Jan 29, 2026',
    recipient: 'Tuition Office',
    amount: 10,
    currency: 'USD',
    status: 'Pending',
  },
];

function StatusPill({ status }: { status: Status }) {
  const done = status === 'Completed';
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1',
        done
          ? 'bg-brand-success/10 text-brand-success ring-brand-success/25'
          : 'bg-brand-orange/10 text-brand-orange ring-brand-orange/30',
      )}
    >
      <span
        aria-hidden
        className={cx(
          'h-1.5 w-1.5 shrink-0 rounded-full',
          done ? 'bg-brand-success' : 'bg-brand-orange',
        )}
      />
      {status}
    </span>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-brand-borderDeep/60 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-mutedDeep">
            {accent ? (
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-brand-orange"
              />
            ) : null}
            {title}
          </div>
          <div
            className={cx(
              'mt-1.5 font-body text-2xl font-semibold tracking-tight tabular-nums',
              accent ? 'text-brand-orange' : 'text-brand-ink',
            )}
          >
            {value}
          </div>
          {subtitle ? (
            <div className="mt-1 text-xs text-brand-mutedDeep">{subtitle}</div>
          ) : null}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center text-brand-mutedDeep">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_TXNS.filter((t) => {
      if (!q) return true;
      return (
        t.recipient.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pages);
  const pageTxns = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const totalSent = filtered
    .filter((t) => t.type === 'Transfer' && t.status !== 'Pending')
    .reduce((s, t) => s + t.amount, 0);

  const pendingList = filtered.filter((t) => t.status === 'Pending');
  const pendingAmount = pendingList.reduce((s, t) => s + t.amount, 0);

  const avgFeeSaved = 12.4;

  return (
    <div className="min-w-0">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl tracking-tight text-brand-ink sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-brand-mutedDeep">
            Review your transfers and settlement status.
          </p>
        </div>

        <Link
          href="/dashboard/send"
          className="inline-flex h-10 items-center justify-center gap-1.5 self-start rounded-full bg-brand-orange px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(244,106,53,0.55)] transition-colors hover:bg-brand-orangeHover"
        >
          Send money
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* ---------- KPI cards ---------- */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard
          title={`Total sent (${DISPLAY_CURRENCY})`}
          value={formatMoney(totalSent, DISPLAY_CURRENCY)}
          icon={<ArrowUpRightIcon className="h-5 w-5" />}
        />
        <KpiCard
          title="Total fee saved"
          value={`$${avgFeeSaved.toFixed(2)}`}
          subtitle="vs. standard wire"
          icon={<BanknotesIcon className="h-5 w-5" />}
        />
        <KpiCard
          title="Pending"
          value={formatMoney(pendingAmount, DISPLAY_CURRENCY)}
          subtitle={`${pendingList.length} awaiting settlement`}
          icon={<ClockIcon className="h-5 w-5" />}
          accent
        />
      </div>

      {/* ---------- Transaction history + search ---------- */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-xl tracking-tight text-brand-ink sm:text-2xl">
            Transaction history
          </h2>
          <p className="mt-1 max-w-xl text-sm text-brand-mutedDeep">
            Recent transfers and settlements. Select a row to view full details.
          </p>
        </div>

        <label className="relative w-full shrink-0 sm:w-[240px]">
          <span className="sr-only">Search transactions</span>
          <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="h-8 w-full rounded-lg border border-brand-borderDeep/60 bg-white pl-8 pr-2.5 text-xs text-brand-ink outline-none placeholder:text-brand-muted/80 focus:border-brand-borderDeep focus:ring-1 focus:ring-brand-borderDeep/50"
          />
        </label>
      </div>

      {/* ---------- Transactions table ---------- */}
      <div className="mt-4 overflow-hidden rounded-xl border border-brand-borderDeep/50 bg-white">
        <div className="overflow-x-auto">
          <table className="table-fixed w-full min-w-[360px] text-sm">
            <thead className="bg-brand-cream/40">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-brand-mutedDeep">
                <th className="w-1/3 px-4 py-2.5">Date</th>
                <th className="w-1/3 px-4 py-2.5">Amount</th>
                <th className="w-1/3 px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderDeep/40">
              {pageTxns.map((t) => (
                <tr
                  key={t.id}
                  className="group relative cursor-pointer transition-colors hover:bg-brand-cream/50 focus-within:bg-brand-cream/50"
                >
                  <td className="relative px-4 py-2.5 text-brand-mutedDeep whitespace-nowrap">
                    <Link
                      href={`/dashboard/transactions/${t.id}`}
                      aria-label={`View transaction ${t.id}`}
                      className="absolute inset-0 z-10 rounded-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-borderDeep"
                    >
                      <span className="sr-only">View transaction {t.id}</span>
                    </Link>
                    {t.date}
                  </td>
                  <td className="px-4 py-2.5 font-semibold tabular-nums text-brand-ink">
                    {formatMoney(t.amount, t.currency)}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusPill status={t.status} />
                  </td>
                </tr>
              ))}
              {pageTxns.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-xs text-brand-mutedDeep"
                  >
                    No transactions match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-brand-borderDeep/50 bg-brand-cream/30 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-brand-mutedDeep">
            {total === 0
              ? '0 transactions'
              : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, total)} of ${total}`}
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="rounded-md border border-brand-borderDeep/60 bg-white px-2.5 py-1 text-xs font-semibold text-brand-ink transition-colors hover:bg-brand-cream disabled:opacity-40 disabled:hover:bg-white"
            >
              Prev
            </button>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
                const n = i + 1;
                const active = n === safePage;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={cx(
                      'h-7 min-w-[1.75rem] rounded-md px-1.5 text-xs font-semibold transition-colors',
                      active
                        ? 'bg-brand-ink text-white'
                        : 'text-brand-ink hover:bg-white',
                    )}
                  >
                    {n}
                  </button>
                );
              })}
              {pages > 5 ? (
                <span className="px-1.5 text-xs text-brand-mutedDeep">…</span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={safePage >= pages}
              className="rounded-md border border-brand-borderDeep/60 bg-white px-2.5 py-1 text-xs font-semibold text-brand-ink transition-colors hover:bg-brand-cream disabled:opacity-40 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
