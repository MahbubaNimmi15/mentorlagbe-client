
import Link from "next/link";

import {
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const roles = [
  {
    title: "Student Dashboard",
    description:
      "Preview application tracking, learning progress and subscription status.",
    href: "/dashboard/student",
    icon: GraduationCap,
    background: "#e3f4e8",
  },
  {
    title: "Tutor Dashboard",
    description:
      "Preview tuition management, applicants and tutor statistics.",
    href: "/dashboard/tutor",
    icon: UserRound,
    background: "#fff0e7",
  },
  {
    title: "Admin Dashboard",
    description:
      "Preview user management, moderation and revenue reporting.",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    background: "#e7f0ff",
  },
];

export default function DashboardHomePage() {
  return (
    <div>
      <span className="rounded-full bg-[#fff0e7] px-4 py-2 text-xs font-bold text-[#ac5d3d]">
        DESIGN PREVIEW
      </span>

      <h1 className="mt-7 text-3xl font-extrabold tracking-tight md:text-4xl">
        Explore the MentorLagbe Dashboard
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f7e89]">
        Select a role to preview its dashboard.
        Real permissions, statistics and account
        information will be connected after authentication
        and database integration.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;

          return (
            <Link
              key={role.href}
              href={role.href}
              className="card-hover flex min-h-[270px] flex-col rounded-[25px] border border-[#e5ebe6] bg-white p-7"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: role.background }}
              >
                <Icon size={29} />
              </div>

              <h2 className="mt-7 text-xl font-extrabold">
                {role.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#72808c]">
                {role.description}
              </p>

              <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-extrabold text-[#c66b49]">
                Open Preview
                <ArrowUpRight size={18} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
