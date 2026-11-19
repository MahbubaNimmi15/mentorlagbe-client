
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

const demoStats = [
  {
    label: "Total Users",
    value: "128",
    detail: "Sample registered accounts",
    icon: Users,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    label: "Total Tutors",
    value: "46",
    detail: "Sample tutor profiles",
    icon: GraduationCap,
    tone: "bg-violet-50 text-violet-700",
  },
  {
    label: "Pending Tuitions",
    value: "12",
    detail: "Awaiting admin approval",
    icon: Clock3,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    label: "Total Stripe Revenue",
    value: "$385",
    detail: "Sample payment amount",
    icon: CreditCard,
    tone: "bg-emerald-50 text-emerald-700",
  },
];

const adminTools = [
  {
    title: "Manage Users",
    description:
      "Review user accounts and manage Student, Tutor and Admin roles.",
    icon: Users,
    href: "/dashboard/admin/users",
    note: "Next feature",
  },
  {
    title: "Tuition Approval",
    description:
      "Review tuition submissions and approve or reject listings.",
    icon: BookOpen,
    href: "/dashboard/admin/tuitions",
    note: "Coming soon",
  },
  {
    title: "Transactions",
    description:
      "View subscription records, payment status and Stripe revenue.",
    icon: CreditCard,
    href: "/dashboard/admin/transactions",
    note: "Coming soon",
  },
];

const demoActivities: Activity[] = [
  {
    id: "ACT-101",
    title: "New Tutor Registration",
    description: "Ayesha Rahman created a sample tutor account.",
    type: "user",
    status: "Completed",
    date: "18 Nov 2026",
  },
  {
    id: "ACT-102",
    title: "Mathematics Tuition Submitted",
    description: "A sample tuition post is awaiting review.",
    type: "tuition",
    status: "Pending",
    date: "17 Nov 2026",
  },
  {
    id: "ACT-103",
    title: "English Tuition Approved",
    description: "A sample tuition listing was approved.",
    type: "tuition",
    status: "Approved",
    date: "16 Nov 2026",
  },
  {
    id: "ACT-104",
    title: "Tutor Pro Subscription",
    description: "A sample Stripe transaction was recorded.",
    type: "payment",
    status: "Completed",
    date: "15 Nov 2026",
  },
];

const statusColors: Record<ActivityStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Completed: "bg-blue-100 text-blue-800",
};

export default function AdminDashboardPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredActivities = useMemo(() => {
    const query = search.toLowerCase().trim();

    return demoActivities.filter((activity) => {
      const matchesQuery = [
        activity.title,
        activity.description,
        activity.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesType =
        typeFilter === "all" || activity.type === typeFilter;

      return matchesQuery && matchesType;
    });
  }, [search, typeFilter]);

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-[#e97c53]">
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

        {/* Welcome */}
        <section className="relative overflow-hidden rounded-3xl bg-[#14243a] p-6 text-white sm:p-9">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                Admin Workspace
              </span>

              <span className="rounded-full bg-[#e97c53]/20 px-3 py-1 text-xs font-semibold text-orange-200">
                Preview Mode
              </span>
            </div>

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e97c53]">
              <ShieldCheck size={29} />
            </div>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Platform Control Center
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-200">
              Manage MentorLagbe users, tuition approvals and
              subscription transactions from one organized dashboard.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-14 -top-14 h-64 w-64 rounded-full border-[38px] border-white/5" />
          <div className="pointer-events-none absolute bottom-0 right-24 h-28 w-28 rounded-full bg-[#e97c53]/10 blur-xl" />
        </section>

        {/* Explicit demo notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Demo Mode:</strong> All statistics and activities
          shown below are sample data. Authentication, MongoDB
          collections, protected Admin APIs and Stripe reporting
          are not connected yet. This page must not be treated
          as a live administration system.
        </div>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {demoStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.tone}`}
                >
                  <Icon size={23} />
                </div>

                <p className="text-xs font-bold text-slate-500 sm:text-sm">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#14243a]">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {stat.detail}
                </p>
              </article>
            );
          })}
        </section>

        {/* Section title */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#e3f4e8] p-3 text-emerald-700">
              <LayoutDashboard size={21} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Administration Tools
              </h2>

              <p className="text-sm text-slate-500">
                Modules planned for the Admin dashboard
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {adminTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <article
                  key={tool.title}
                  className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-orange-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0e7] text-[#e97c53]">
                      <Icon size={23} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {tool.note}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-[#14243a]">
                    {tool.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                    {tool.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-400">
                    Not available yet
                    <ArrowRight size={16} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Recent activity */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Recent Activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sample events for Admin UI testing
              </p>
            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              Sample Data
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-3.5 text-slate-400"
              />

              <label htmlFor="activity-search" className="sr-only">
                Search activity
              </label>

              <input
                id="activity-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search recent activity..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#e97c53]"
              />
            </div>

            <div>
              <label htmlFor="activity-type" className="sr-only">
                Filter activity type
              </label>

              <select
                id="activity-type"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#e97c53]"
              >
                <option value="all">All Activity</option>
                <option value="user">Users</option>
                <option value="tuition">Tuitions</option>
                <option value="payment">Payments</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <p className="font-bold text-[#14243a]">
                  No matching activities
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try another search or filter.
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
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
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${statusColors[activity.status]}`}
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

        {/* Roadmap note */}
        <section className="rounded-2xl border border-[#e3f4e8] bg-[#e3f4e8] p-5">
          <p className="text-sm font-bold text-[#14243a]">
            Next implementation: Admin User Management
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            We will add a user list, search, role filters and
            role-change confirmations. Real account permissions
            will only be enabled after secure authentication and
            backend authorization are implemented.
          </p>
        </section>
      </div>
    </main>
  );
}
