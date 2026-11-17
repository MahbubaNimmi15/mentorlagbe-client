
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

type Props = {
  children: ReactNode;
};

const navigation = [
  {
    label: "Student Dashboard",
    href: "/dashboard/student",
    icon: GraduationCap,
  },
  {
    label: "Tutor Dashboard",
    href: "/dashboard/tutor",
    icon: UserRound,
  },
  {
    label: "Admin Dashboard",
    href: "/dashboard/admin",
    icon: ShieldCheck,
  },
];

export function DashboardShell({ children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const currentRole =
    pathname.startsWith("/dashboard/student")
      ? "Student"
      : pathname.startsWith("/dashboard/tutor")
        ? "Tutor"
        : pathname.startsWith("/dashboard/admin")
          ? "Admin"
          : "Overview";

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  const sidebarContent = (
    <>
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        {!collapsed && (
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 text-lg font-extrabold text-white"
          >
            <GraduationCap size={25} />
            MentorLagbe
          </Link>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={
            collapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          className="hidden rounded-lg p-2 text-white hover:bg-white/10 lg:block"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close dashboard menu"
          className="rounded-lg p-2 text-white lg:hidden"
        >
          <X size={22} />
        </button>
      </div>

      <nav
        className="flex flex-col gap-2 p-4"
        aria-label="Dashboard preview navigation"
      >
        <Link
          href="/dashboard"
          title="Dashboard Home"
          onClick={closeMobileMenu}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            pathname === "/dashboard"
              ? "bg-[#ff8b63] text-[#14243a]"
              : "text-[#c5d0da] hover:bg-white/10"
          }`}
        >
          <LayoutDashboard size={20} className="shrink-0" />
          {!collapsed && <span>Dashboard Home</span>}
        </Link>

        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#ff8b63] text-[#14243a]"
                  : "text-[#c5d0da] hover:bg-white/10"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-bold text-[#ffd4bd]">
              UI PREVIEW
            </p>
            <p className="mt-2 text-xs leading-6 text-[#c5d0da]">
              Role selection is for design testing only.
              Authentication will be added later.
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          title="Back to Website"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#c5d0da] hover:bg-white/10"
        >
          <ArrowLeft size={19} className="shrink-0" />
          {!collapsed && <span>Back to Website</span>}
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f6f8f6] lg:flex">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex w-[270px] flex-col bg-[#14243a] transition-transform duration-200 lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } ${collapsed ? "lg:w-[88px]" : "lg:w-[270px]"}`}
      >
        {sidebarContent}
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex min-h-20 items-center justify-between gap-4 border-b border-[#e6ebe7] bg-white px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open dashboard menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-[#e4e9e6] p-2.5 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-xs font-semibold text-[#84919c]">
                MentorLagbe / Dashboard
              </p>
              <h2 className="mt-1 text-lg font-extrabold">
                {currentRole} {currentRole === "Overview" ? "" : "Overview"}
              </h2>
            </div>
          </div>

          <span className="rounded-full bg-[#fff0e7] px-4 py-2 text-xs font-bold text-[#a85a3b]">
            Preview Mode
          </span>
        </header>

        <div className="mx-auto w-full max-w-[1500px] p-5 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
