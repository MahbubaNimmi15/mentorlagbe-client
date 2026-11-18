
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  PlusCircle,
  Users,
  Wallet,
} from "lucide-react";

const stats = [
  {
    title: "Total Tuitions",
    value: "0",
    description: "No tuition posts connected yet",
    icon: BookOpen,
  },
  {
    title: "Approved & Active",
    value: "0",
    description: "No approved listings yet",
    icon: CheckCircle2,
  },
  {
    title: "Total Applicants",
    value: "0",
    description: "No student applications yet",
    icon: Users,
  },
  {
    title: "Current Plan",
    value: "—",
    description: "Plan will load after authentication",
    icon: Wallet,
  },
];

const managementTools = [
  {
    title: "Post New Tuition",
    description:
      "Create a new tuition listing with validation and banner preview.",
    href: "/dashboard/tutor/post-tuition",
    icon: PlusCircle,
    buttonText: "Create Tuition",
  },
  {
    title: "My Tuitions",
    description:
      "View demo listings, edit details, delete and change active status.",
    href: "/dashboard/tutor/my-tuitions",
    icon: BookOpen,
    buttonText: "Manage Tuitions",
  },
  {
    title: "Review Applicants",
    description:
      "Review student applications and accept or reject applicants.",
    href: "/dashboard/tutor/applicants",
    icon: ClipboardList,
    buttonText: "Coming Next",
    comingSoon: true,
  },
];

export default function TutorDashboardPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
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
          <span className="font-semibold text-[#14243a]">
            Tutor
          </span>
        </div>

        {/* Heading */}
        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#e3f4e8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#28765b]">
              Tutor Overview
            </span>

            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              Preview Mode
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e97c53]">
            Tutor Workspace
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#14243a] sm:text-4xl">
            Your teaching workspace.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Manage tuition opportunities and student
            applications from one organized workspace.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/tutor/post-tuition"
              className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d96c45]"
            >
              <PlusCircle size={18} />
              Post New Tuition
            </Link>

            <Link
              href="/dashboard/tutor/my-tuitions"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#14243a] transition hover:border-[#e97c53] hover:text-[#e97c53]"
            >
              <BookOpen size={18} />
              My Tuitions
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-600">
                    {stat.title}
                  </p>

                  <div className="rounded-xl bg-[#fff0e7] p-3 text-[#e97c53]">
                    <Icon size={19} />
                  </div>
                </div>

                <p className="text-3xl font-extrabold text-[#14243a]">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Current Listings */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#14243a]">
              My Tuition Listings
            </h2>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              API Pending
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-[#fafbfc] px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f4e8] text-[#28765b]">
              <GraduationCap size={26} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#14243a]">
              No connected tuition listings yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Real listings will appear here after
              authentication and database integration.
              You can explore the demo management page now.
            </p>

            <Link
              href="/dashboard/tutor/my-tuitions"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#233953]"
            >
              View 3 Demo Tuitions
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Management Tools */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#14243a]">
              Tutor Management Tools
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Explore the available tutor features.
              Database integration will be added later.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {managementTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <article
                  key={tool.title}
                  className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 inline-flex rounded-xl bg-[#fff0e7] p-3 text-[#e97c53]">
                    <Icon size={23} />
                  </div>

                  <h3 className="text-lg font-bold text-[#14243a]">
                    {tool.title}
                  </h3>

                  <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500">
                    {tool.description}
                  </p>

                  {tool.comingSoon ? (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400">
                      {tool.buttonText}
                    </span>
                  ) : (
                    <Link
                      href={tool.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#e97c53] hover:underline"
                    >
                      {tool.buttonText}
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Upgrade */}
        <section className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#14243a] p-7 text-white sm:p-8">
          <div>
            <h2 className="text-xl font-bold">
              Grow your tutoring opportunities
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Free tutors can publish up to two tuition
              listings once the backend is connected.
              Tutor Pro supports unlimited listings.
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white hover:bg-[#d96c45]"
          >
            Explore Pro Plans
            <ArrowRight size={16} />
          </Link>
        </section>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
          <strong>Demo notice:</strong> The overview
          statistics show zero because real database
          records are not connected. The separate
          My Tuitions page contains three sample listings
          for UI testing only.
        </div>
      </div>
    </main>
  );
}
