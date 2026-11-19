
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

type ActivityType = "user" | "tuition" | "payment";
type ActivityStatus = "Pending" | "Approved" | "Completed";

type Activity = {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  status: ActivityStatus;
  date: string;
};

const stats = [
  {
    title: "Total Users",
    value: "128",
    description: "Sample user accounts",
    icon: Users,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Total Tutors",
    value: "46",
    description: "Sample tutor profiles",
    icon: GraduationCap,
    color: "bg-violet-50 text-violet-700",
  },
  {
    title: "Pending Tuitions",
    value: "12",
    description: "Sample pending listings",
    icon: Clock3,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Stripe Revenue",
    value: "$385",
    description: "Sample revenue only",
    icon: CreditCard,
    color: "bg-emerald-50 text-emerald-700",
  },
];

const adminPages = [
  {
    title: "User Management",
    description:
      "View user profiles, search accounts, filter roles and preview role changes.",
    href: "/dashboard/admin/users",
    icon: Users,
    button: "Manage Users",
    tag: "Demo UI",
  },
  {
    title: "Tuition Approval",
    description:
      "Review tutor submissions, inspect tuition details and approve or reject demo listings.",
    href: "/dashboard/admin/tuitions",
    icon: BookOpen,
    button: "Review Tuitions",
    tag: "Demo UI",
  },
  {
    title: "Transactions",
    description:
      "Explore sample subscription payments, transaction details and revenue statistics.",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
    button: "View Transactions",
    tag: "Demo UI",
  },
];

const activities: Activity[] = [
  {
    id: "ACT-101",
    title: "New Tutor Registration",
    description:
      "Ayesha Rahman created a sample tutor account.",
    type: "user",
    status: "Completed",
    date: "18 Nov 2026",
  },
  {
    id: "ACT-102",
    title: "Mathematics Tuition Submitted",
    description:
      "A sample mathematics listing is awaiting approval.",
    type: "tuition",
    status: "Pending",
    date: "17 Nov 2026",
  },
  {
    id: "ACT-103",
    title: "English Tuition Approved",
    description:
      "A sample tuition was approved for public listing.",
    type: "tuition",
    status: "Approved",
    date: "16 Nov 2026",
  },
  {
    id: "ACT-104",
    title: "Tutor Pro Subscription",
    description:
      "A fictional subscription payment was recorded.",
    type: "payment",
    status: "Completed",
    date: "15 Nov 2026",
  },
];

const activityColors: Record<ActivityStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Completed: "bg-blue-100 text-blue-800",
};

export default function AdminDashboardPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const visibleActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const searchable = [
        activity.id,
        activity.title,
        activity.description,
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchable.includes(query) &&
        (filter === "all" || activity.type === filter)
      );
    });
  }, [search, filter]);

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link
            href="/"
            className="hover:text-[#e97c53]"
          >
            MentorLagbe
          </Link>

          <span>/</span>

          <Link
            href="/dashboard"
            className="hover:text-[#e97c53]"
          >
            Dashboard
          </Link>

          <span>/</span>

          <span className="font-bold text-[#14243a]">
            Admin
          </span>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-[#14243a] p-6 text-white sm:p-9">
          <div className="relative z-10">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Admin Workspace
              </span>

              <span className="rounded-full bg-orange-400/20 px-3 py-1 text-xs font-semibold text-orange-200">
                Preview Mode
              </span>
            </div>

            <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e97c53]">
              <ShieldCheck size={28} />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              Platform Control Center
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
              Manage the MentorLagbe platform from one
              workspace. Explore user management, tuition
              moderation and subscription transactions.
            </p>

            {/* Quick navigation */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/dashboard/admin/users"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white hover:bg-[#d96c45]"
              >
                <Users size={18} />
                Manage Users
              </Link>

              <Link
                href="/dashboard/admin/tuitions"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20"
              >
                <BookOpen size={18} />
                Tuition Approval
              </Link>

              <Link
                href="/dashboard/admin/transactions"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20"
              >
                <CreditCard size={18} />
                Transactions
              </Link>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[40px] border-white/5" />
        </section>

        {/* Demo notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Demo Mode:</strong> All statistics,
          activities, users, tuitions and transactions
          are sample data. MongoDB, Better Auth and
          protected Admin APIs are not connected.
          No administrative changes affect real accounts.
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={23} />
                </div>

                <p className="text-sm font-semibold text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-extrabold text-[#14243a]">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </section>

        {/* Admin modules */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#e3f4e8] p-3 text-emerald-700">
              <LayoutDashboard size={22} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Administration Tools
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a module to open its management page.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {adminPages.map((page) => {
              const Icon = page.icon;

              return (
                <article
                  key={page.href}
                  className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0e7] text-[#e97c53]">
                      <Icon size={23} />
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                      {page.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-[#14243a]">
                    {page.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                    {page.description}
                  </p>

                  <Link
                    href={page.href}
                    className="mt-6 inline-flex items-center gap-2 self-start rounded-xl bg-[#14243a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#233953]"
                  >
                    {page.button}
                    <ArrowRight size={17} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sample activities for preview testing
              </p>
            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              Demo Data
            </span>
          </div>

          {/* Filters */}
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-3.5 text-slate-400"
              />

              <label htmlFor="admin-search" className="sr-only">
                Search activity
              </label>

              <input
                id="admin-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search activities..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#e97c53]"
              />
            </div>

            <div>
              <label htmlFor="admin-filter" className="sr-only">
                Filter activity
              </label>

              <select
                id="admin-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#e97c53]"
              >
                <option value="all">All Activities</option>
                <option value="user">Users</option>
                <option value="tuition">Tuitions</option>
                <option value="payment">Payments</option>
              </select>
            </div>
          </div>

          {/* Activity list */}
          <div className="mt-6 space-y-3">
            {visibleActivities.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <h3 className="font-bold text-[#14243a]">
                  No matching activities
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search or filter.
                </p>
              </div>
            ) : (
              visibleActivities.map((activity) => (
                <article
                  key={activity.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 sm:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-400">
                      {activity.date} · {activity.id}
                    </p>

                    <h3 className="mt-2 text-sm font-bold text-[#14243a]">
                      {activity.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {activity.description}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${activityColors[activity.status]}`}
                  >
                    {activity.status === "Approved" && (
                      <CheckCircle2 size={13} />
                    )}

                    {activity.status}
                  </span>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Integration status */}
        <section className="rounded-2xl bg-[#e3f4e8] p-5">
          <h2 className="text-sm font-extrabold text-[#14243a]">
            Next Phase: Real Backend Integration
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            The Admin navigation is ready for UI testing.
            The next major task is MongoDB Atlas connection,
            followed by Better Auth, JWT verification and
            secure role-based APIs.
          </p>
        </section>
      </div>
    </main>
  );
}
