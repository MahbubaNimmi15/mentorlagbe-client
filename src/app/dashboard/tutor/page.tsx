
import Link from "next/link";

import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Users,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";

const plannedFeatures = [
  "Post a new tuition batch",
  "Edit and manage tuition listings",
  "Open or close active batches",
  "Review student applications",
  "Accept or reject applicants",
];

export default function TutorDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-[#fff0e7] px-4 py-2 text-xs font-bold text-[#a85a3b]">
            TUTOR OVERVIEW
          </span>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">
            Your teaching workspace.
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#71808c]">
            Manage tuition opportunities and applicants
            from one organized workspace.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tuitions"
          value="0"
          description="No tuition posts connected yet"
          icon={<BookOpen size={23} />}
          accent="orange"
        />

        <StatCard
          title="Approved & Active"
          value="0"
          description="No approved listings yet"
          icon={<CheckCircle2 size={23} />}
          accent="green"
        />

        <StatCard
          title="Total Applicants"
          value="0"
          description="No student applications yet"
          icon={<Users size={23} />}
          accent="blue"
        />

        <StatCard
          title="Current Plan"
          value="—"
          description="Plan will load after authentication"
          icon={<GraduationCap size={23} />}
          accent="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[25px] border border-[#e6ebe7] bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">
              My Tuition Listings
            </h2>
            <span className="rounded-full bg-[#fff0e7] px-3 py-1.5 text-xs font-bold text-[#a85a3b]">
              API Pending
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-[#f7faf7] px-5 py-12 text-center">
            <BookOpen
              size={35}
              className="mx-auto text-[#819b8e]"
            />

            <h3 className="mt-5 font-extrabold">
              No tuition listings yet
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#72808c]">
              Tuition posting and management will be
              available once role-based authentication and
              database APIs are connected.
            </p>
          </div>
        </section>

        <section className="rounded-[25px] border border-[#e6ebe7] bg-white p-7">
          <h2 className="text-xl font-extrabold">
            Tutor Management Tools
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#72808c]">
            These features will be implemented in the
            Tutor CRUD phase.
          </p>

          <div className="mt-6 space-y-4">
            {plannedFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-xl bg-[#f7faf7] p-4 text-sm font-semibold"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-[#548b70]"
                />
                {feature}
              </div>
            ))}
          </div>

          <Link
            href="/pricing"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#c66b49]"
          >
            Explore Pro Plans
            <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>
    </div>
  );
}
