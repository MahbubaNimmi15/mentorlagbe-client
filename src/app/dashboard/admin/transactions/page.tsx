
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Eye,
  RotateCcw,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

type UserRole = "student" | "tutor";
type PaymentStatus = "paid" | "pending" | "failed";
type PaymentFilter = "all" | PaymentStatus;
type RoleFilter = "all" | UserRole;

type Transaction = {
  id: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  planName: string;
  amount: number;
  currency: "USD";
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
};

const demoTransactions: Transaction[] = [
  {
    id: "PAY-101",
    userName: "Ayesha Rahman",
    userEmail: "ayesha@example.com",
    userRole: "tutor",
    planName: "Tutor Pro",
    amount: 15,
    currency: "USD",
    transactionId: "demo_txn_101",
    stripeSessionId: "demo_session_101",
    paymentStatus: "paid",
    paidAt: "2026-11-18",
  },
  {
    id: "PAY-102",
    userName: "Rafi Ahmed",
    userEmail: "rafi@example.com",
    userRole: "student",
    planName: "Student Pro",
    amount: 10,
    currency: "USD",
    transactionId: "demo_txn_102",
    stripeSessionId: "demo_session_102",
    paymentStatus: "paid",
    paidAt: "2026-11-17",
  },
  {
    id: "PAY-103",
    userName: "Tanvir Hasan",
    userEmail: "tanvir@example.com",
    userRole: "tutor",
    planName: "Tutor Pro",
    amount: 15,
    currency: "USD",
    transactionId: "demo_txn_103",
    stripeSessionId: "demo_session_103",
    paymentStatus: "paid",
    paidAt: "2026-11-16",
  },
  {
    id: "PAY-104",
    userName: "Nusrat Jahan",
    userEmail: "nusrat@example.com",
    userRole: "student",
    planName: "Student Pro",
    amount: 10,
    currency: "USD",
    transactionId: "demo_txn_104",
    stripeSessionId: "demo_session_104",
    paymentStatus: "pending",
    paidAt: null,
  },
  {
    id: "PAY-105",
    userName: "Sadia Islam",
    userEmail: "sadia@example.com",
    userRole: "student",
    planName: "Student Pro",
    amount: 10,
    currency: "USD",
    transactionId: "demo_txn_105",
    stripeSessionId: "demo_session_105",
    paymentStatus: "failed",
    paidAt: null,
  },
  {
    id: "PAY-106",
    userName: "Nabila Ahmed",
    userEmail: "nabila@example.com",
    userRole: "tutor",
    planName: "Tutor Pro",
    amount: 15,
    currency: "USD",
    transactionId: "demo_txn_106",
    stripeSessionId: "demo_session_106",
    paymentStatus: "paid",
    paidAt: "2026-11-12",
  },
];

const statusStyles: Record<PaymentStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
};

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-orange-400";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value: string | null): string {
  if (!value) return "Not paid";

  return new Date(`${value}T12:00:00`).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("all");

  const [paymentFilter, setPaymentFilter] =
    useState<PaymentFilter>("all");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const stats = useMemo(() => {
    const paidTransactions = demoTransactions.filter(
      (item) => item.paymentStatus === "paid"
    );

    return {
      total: demoTransactions.length,
      paid: paidTransactions.length,
      pending: demoTransactions.filter(
        (item) => item.paymentStatus === "pending"
      ).length,
      revenue: paidTransactions.reduce(
        (sum, item) => sum + item.amount,
        0
      ),
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return demoTransactions.filter((item) => {
      const matchesSearch = [
        item.id,
        item.userName,
        item.userEmail,
        item.planName,
        item.transactionId,
        item.stripeSessionId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesRole =
        roleFilter === "all" ||
        item.userRole === roleFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        item.paymentStatus === paymentFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesPayment
      );
    });
  }, [search, roleFilter, paymentFilter]);

  const selectedTransaction = selectedId
    ? demoTransactions.find((item) => item.id === selectedId)
    : null;

  function resetFilters() {
    setSearch("");
    setRoleFilter("all");
    setPaymentFilter("all");
    setSelectedId(null);
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              <ArrowLeft size={17} />
              Admin Overview
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#e97c53]">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#14243a]">
              Transaction Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review subscription payments and revenue.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
            <ShieldCheck size={18} />
            Demo Mode
          </div>
        </header>

        {/* Demo notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Sample Payments Only:</strong> No real
          Stripe transactions have been loaded. All payment
          identifiers and amounts displayed here are
          fictional. Real payment history will come from
          protected backend APIs after Stripe and MongoDB
          integration.
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Transactions",
              value: String(stats.total),
              icon: CreditCard,
              tone: "bg-blue-50 text-blue-700",
            },
            {
              label: "Successful Payments",
              value: String(stats.paid),
              icon: CheckCircle2,
              tone: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Pending Payments",
              value: String(stats.pending),
              icon: Users,
              tone: "bg-amber-50 text-amber-700",
            },
            {
              label: "Total Revenue",
              value: formatMoney(stats.revenue),
              icon: DollarSign,
              tone: "bg-violet-50 text-violet-700",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${stat.tone}`}
                >
                  <Icon size={21} />
                </div>

                <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                  {stat.label}
                </p>

                <p className="mt-2 break-words text-2xl font-extrabold text-[#14243a] sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Demo Data
                </p>
              </article>
            );
          })}
        </section>

        {/* Transactions */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Subscription Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredTransactions.length} of{" "}
                {demoTransactions.length} sample records
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset Filters
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_170px_170px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-3.5 text-slate-400"
              />

              <label
                htmlFor="transaction-search"
                className="sr-only"
              >
                Search transactions
              </label>

              <input
                id="transaction-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search user, email, transaction ID..."
                className={`${fieldClass} pl-11`}
              />
            </div>

            <div>
              <label
                htmlFor="transaction-role"
                className="sr-only"
              >
                Filter user role
              </label>

              <select
                id="transaction-role"
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value as RoleFilter
                  )
                }
                className={fieldClass}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="tutor">Tutors</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="payment-status"
                className="sr-only"
              >
                Filter payment status
              </label>

              <select
                id="payment-status"
                value={paymentFilter}
                onChange={(event) =>
                  setPaymentFilter(
                    event.target.value as PaymentFilter
                  )
                }
                className={fieldClass}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Responsive table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Plan</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Paid Date</th>
                  <th className="px-4 py-4">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-orange-50/40"
                  >
                    <td className="px-4 py-4">
                      <p className="font-bold text-[#14243a]">
                        {item.userName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.userEmail}
                      </p>
                      <p className="mt-1 text-xs capitalize text-slate-400">
                        {item.userRole} · {item.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {item.planName}
                    </td>

                    <td className="px-4 py-4 font-bold text-[#14243a]">
                      {formatMoney(item.amount)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[item.paymentStatus]}`}
                      >
                        {capitalize(item.paymentStatus)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-500">
                      {formatDate(item.paidAt)}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-10 text-center">
                <h3 className="font-bold text-[#14243a]">
                  No transactions found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different search or filter.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Future integration */}
        <section className="rounded-2xl bg-[#e3f4e8] p-5">
          <h2 className="text-sm font-extrabold text-[#14243a]">
            Payment Integration Status
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            Stripe Checkout, secure payment verification,
            the payments collection and real revenue
            reporting will be implemented after
            MongoDB and authentication are connected.
          </p>
        </section>
      </div>

      {/* Transaction detail modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-details-heading"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="transaction-details-heading"
                className="text-xl font-extrabold text-[#14243a]"
              >
                Transaction Details
              </h2>

              <button
                type="button"
                aria-label="Close transaction details"
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              Demo transaction — not a real Stripe payment.
            </p>

            <div className="mt-6 space-y-4">
              {[
                ["Record ID", selectedTransaction.id],
                ["User Name", selectedTransaction.userName],
                ["User Email", selectedTransaction.userEmail],
                [
                  "User Role",
                  capitalize(selectedTransaction.userRole),
                ],
                ["Plan Name", selectedTransaction.planName],
                [
                  "Amount",
                  formatMoney(selectedTransaction.amount),
                ],
                [
                  "Payment Status",
                  capitalize(selectedTransaction.paymentStatus),
                ],
                [
                  "Transaction ID",
                  selectedTransaction.transactionId,
                ],
                [
                  "Stripe Session ID",
                  selectedTransaction.stripeSessionId,
                ],
                [
                  "Payment Date",
                  formatDate(selectedTransaction.paidAt),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-slate-100 pb-3"
                >
                  <p className="text-xs font-bold text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-[#14243a]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="mt-6 w-full rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white hover:bg-[#233953]"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
