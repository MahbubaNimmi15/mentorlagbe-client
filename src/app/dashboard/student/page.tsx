
import Link from "next/link";

import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-[#347457]">
            STUDENT OVERVIEW
          </span>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">
            Your learning space.
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#71808c]">
            Track your learning journey from one
            organized dashboard.
          </p>
        </div>

        <Link
          href="/dashboard/student/my-applications"
          className="btn-primary"
        >
          My Applications
          <ArrowUpRight size={18} />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Applications"
          value="0"
          description="Demo count — live data pending"
          icon={<BookOpen size={23} />}
          accent="blue"
        />

        <StatCard
          title="Accepted"
          value="0"
          description="Demo count — live data pending"
          icon={<CheckCircle2 size={23} />}
          accent="green"
        />

        <StatCard
          title="Pending"
          value="0"
          description="Demo count — live data pending"
          icon={<Clock3 size={23} />}
          accent="orange"
        />

        <StatCard
          title="Current Plan"
          value="—"
          description="Subscription data not connected"
          icon={<GraduationCap size={23} />}
          accent="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[25px] border border-[#e6ebe7] bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">
              Application Management
            </h2>

            <span className="rounded-full bg-[#fff0e7] px-3 py-1.5 text-xs font-bold text-[#a85a3b]">
              Demo Preview
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-[#f7faf7] px-5 py-12 text-center">
            <BookOpen
              size={35}
              className="mx-auto text-[#819b8e]"
            />

            <h3 className="mt-5 text-lg font-extrabold">
              Preview My Applications
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#72808c]">
              Explore the application table, status
              filters and pending cancellation interface
              using temporary demonstration data.
            </p>

            <Link
              href="/dashboard/student/my-applications"
              className="btn-primary mt-6"
            >
              Open My Applications
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

        <section className="rounded-[25px] bg-[#14243a] p-7 text-white">
          <span className="text-xs font-bold uppercase tracking-[2px] text-[#ffb996]">
            LEARNING JOURNEY
          </span>

          <h2 className="mt-5 text-2xl font-extrabold">
            Find your next mentor.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#bccbd6]">
            Browse subjects, class levels and schedules
            to discover learning opportunities.
          </p>

          <Link
            href="/tuitions"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#ff8b63] px-5 py-3 text-sm font-bold text-[#14243a]"
          >
            Browse Tuitions
            <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>
    </div>
  );
}
