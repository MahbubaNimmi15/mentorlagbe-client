
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  DollarSign,
  ShieldCheck,
  Users,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";

const features = [
  {
    title: "User Management",
    description:
      "Manage Student, Tutor and Admin roles.",
    icon: Users,
  },
  {
    title: "Tuition Moderation",
    description:
      "Review and approve or reject tuition posts.",
    icon: ShieldCheck,
  },
  {
    title: "Transaction Management",
    description:
      "Review Stripe payment records and revenue.",
    icon: DollarSign,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="rounded-full bg-[#e7f0ff] px-4 py-2 text-xs font-bold text-[#4270ac]">
          ADMIN OVERVIEW
        </span>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">
          Platform control center.
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#71808c]">
          A central workspace for platform moderation,
          user management and financial reporting.
        </p>

        <p className="mt-3 text-xs font-bold text-[#b36145]">
          UI Preview — not a protected admin account
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value="0"
          description="User records not connected"
          icon={<Users size={23} />}
          accent="blue"
        />

        <StatCard
          title="Total Tutors"
          value="0"
          description="Tutor records not connected"
          icon={<BookOpen size={23} />}
          accent="purple"
        />

        <StatCard
          title="Pending Tuitions"
          value="0"
          description="No moderation records yet"
          icon={<Clock3 size={23} />}
          accent="orange"
        />

        <StatCard
          title="Stripe Revenue"
          value="—"
          description="Payments not connected"
          icon={<DollarSign size={23} />}
          accent="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[25px] border border-[#e6ebe7] bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">
              Tuition Approval Queue
            </h2>

            <span className="rounded-full bg-[#fff0e7] px-3 py-1.5 text-xs font-bold text-[#a85a3b]">
              API Pending
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-[#f7faf7] px-5 py-12 text-center">
            <CheckCircle2
              size={36}
              className="mx-auto text-[#799c86]"
            />

            <h3 className="mt-5 font-extrabold">
              No moderation records
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#72808c]">
              Submitted tuition listings will appear
              here for approval or rejection after
              backend integration.
            </p>
          </div>
        </section>

        <section className="rounded-[25px] border border-[#e6ebe7] bg-white p-7">
          <h2 className="text-xl font-extrabold">
            Administration Tools
          </h2>

          <div className="mt-6 space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex gap-4 rounded-2xl bg-[#f7faf7] p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e3f4e8]">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-[#72808c]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs leading-6 text-[#8a96a0]">
            Admin actions will require verified admin
            authorization in the completed platform.
          </p>
        </section>
      </div>
    </div>
  );
}
