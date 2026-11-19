
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  BookOpen,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";

export type DashboardRole = "student" | "tutor" | "admin";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
};

type NavigationProps = {
  role: DashboardRole;
  collapsed?: boolean;
  onNavigate?: () => void;
};

const studentLinks: NavItem[] = [
  {
    label: "Student Overview",
    href: "/dashboard/student",
    icon: LayoutDashboard,
  },
  {
    label: "My Applications",
    href: "/dashboard/student/my-applications",
    icon: ClipboardList,
  },
  {
    label: "Browse Tuitions",
    href: "/tuitions",
    icon: BookOpen,
  },
];

const tutorLinks: NavItem[] = [
  {
    label: "Tutor Overview",
    href: "/dashboard/tutor",
    icon: LayoutDashboard,
  },
  {
    label: "Post New Tuition",
    href: "/dashboard/tutor/post-tuition",
    icon: PlusCircle,
  },
  {
    label: "My Tuitions",
    href: "/dashboard/tutor/my-tuitions",
    icon: BookOpen,
  },
  {
    label: "Manage Applicants",
    href: "/dashboard/tutor/applicants",
    icon: Users,
  },
];

const adminLinks: NavItem[] = [
  {
    label: "Admin Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Tuition Approval",
    href: "/dashboard/admin/tuitions",
    icon: ShieldCheck,
  },
  {
    label: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
];

const sharedLinks: NavItem[] = [
  {
    label: "Update Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
  },
  {
    label: "Explore Pro Plans",
    href: "/pricing",
    icon: Wallet,
  },
];

const roleLinks: Record<DashboardRole, NavItem[]> = {
  student: studentLinks,
  tutor: tutorLinks,
  admin: adminLinks,
};

function NavigationLink({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  const isActive =
    pathname === item.href ||
    (pathname.startsWith(`${item.href}/`) &&
      ![
        "/dashboard/student",
        "/dashboard/tutor",
        "/dashboard/admin",
      ].includes(item.href));

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        collapsed ? "justify-center px-2" : ""
      } ${
        isActive
          ? "bg-[#ff8b63] text-[#14243a]"
          : "text-[#c5d0da] hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function DashboardNavigation({
  role,
  collapsed = false,
  onNavigate,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={`${role} dashboard navigation`}
      className="space-y-5"
    >
      <section aria-label={`${role} workspace links`}>
        {!collapsed && (
          <p className="mb-3 px-4 text-xs font-bold uppercase tracking-[0.14em] text-[#ffd4bd]">
            {role} Workspace
          </p>
        )}

        <div className="space-y-1">
          {roleLinks[role].map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      <section
        aria-label="Account navigation"
        className="border-t border-white/10 pt-5"
      >
        {!collapsed && (
          <p className="mb-3 px-4 text-xs font-bold uppercase tracking-[0.14em] text-[#ffd4bd]">
            Account & Subscription
          </p>
        )}

        <div className="space-y-1">
          {sharedLinks.map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>
    </nav>
  );
}

const previewRoles: {
  label: string;
  role: DashboardRole;
  href: string;
}[] = [
  {
    label: "Student",
    role: "student",
    href: "/dashboard/student",
  },
  {
    label: "Tutor",
    role: "tutor",
    href: "/dashboard/tutor",
  },
  {
    label: "Admin",
    role: "admin",
    href: "/dashboard/admin",
  },
];

export function DashboardRoleSwitcher({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const currentRole: DashboardRole | null =
    pathname.startsWith("/dashboard/admin")
      ? "admin"
      : pathname.startsWith("/dashboard/tutor")
        ? "tutor"
        : pathname.startsWith("/dashboard/student")
          ? "student"
          : null;

  return (
    <div
      className={`rounded-2xl bg-white/10 ${
        collapsed ? "p-2" : "p-4"
      }`}
    >
      {!collapsed && (
        <>
          <div className="mb-2 flex items-center gap-2 text-[#ffd4bd]">
            <GraduationCap size={18} />
            <p className="text-xs font-bold uppercase tracking-wide">
              UI Preview
            </p>
          </div>

          <p className="mb-4 text-xs leading-5 text-[#c5d0da]">
            Choose a demo workspace. This does not change
            account permissions.
          </p>
        </>
      )}

      <div
        className={
          collapsed
            ? "flex flex-col gap-2"
            : "grid grid-cols-3 gap-2"
        }
      >
        {previewRoles.map((option) => (
          <Link
            key={option.role}
            href={option.href}
            title={option.label}
            aria-label={`${option.label} dashboard preview`}
            onClick={onNavigate}
            className={`rounded-lg px-2 py-2 text-center text-xs font-bold transition ${
              currentRole === option.role
                ? "bg-[#ff8b63] text-[#14243a]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {collapsed ? option.label.charAt(0) : option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
