
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
  X,
} from "lucide-react";

import {
  DashboardNavigation,
  DashboardRoleSwitcher,
  type DashboardRole,
} from "./dashboard-navigation";

type Props = {
  children: ReactNode;
};

function getCurrentRole(pathname: string): DashboardRole {
  if (pathname.startsWith("/dashboard/admin")) {
    return "admin";
  }

  if (pathname.startsWith("/dashboard/tutor")) {
    return "tutor";
  }

  return "student";
}

function getPageTitle(pathname: string): string {
  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard Overview",
    "/dashboard/student": "Student Overview",
    "/dashboard/student/my-applications": "My Applications",
    "/dashboard/tutor": "Tutor Overview",
    "/dashboard/tutor/post-tuition": "Post New Tuition",
    "/dashboard/tutor/my-tuitions": "My Tuitions",
    "/dashboard/tutor/applicants": "Manage Applicants",
    "/dashboard/admin": "Admin Overview",
    "/dashboard/admin/users": "User Management",
    "/dashboard/admin/tuitions": "Tuition Approval",
    "/dashboard/admin/transactions": "Transactions",
    "/dashboard/profile": "Update Profile",
  };

  return pageTitles[pathname] ?? "Dashboard";
}

export function DashboardShell({ children }: Props) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const role = getCurrentRole(pathname);
  const pageTitle = getPageTitle(pathname);

  // On mobile, always display menu labels when open.
  const sidebarCollapsed = collapsed && !mobileOpen;

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function toggleDesktopSidebar() {
    setCollapsed((current) => !current);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f6f8f6] lg:flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close dashboard sidebar overlay"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-[60] bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard sidebar"
        className={`fixed inset-y-0 left-0 z-[70] flex h-dvh w-[270px] flex-col bg-[#14243a] transition-[transform,width] duration-200 lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } ${
          collapsed ? "lg:w-[88px]" : "lg:w-[270px]"
        }`}
      >
        {/* Sidebar header */}
        <div
          className={`flex h-20 shrink-0 items-center border-b border-white/10 ${
            sidebarCollapsed
              ? "justify-center px-2"
              : "justify-between gap-2 px-5"
          }`}
        >
          <Link
            href="/dashboard"
            title="MentorLagbe Dashboard"
            aria-label="MentorLagbe Dashboard Home"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-2 text-lg font-extrabold text-white"
          >
            <GraduationCap
              size={25}
              className="shrink-0 text-[#ff8b63]"
            />

            {!sidebarCollapsed && (
              <span className="truncate">MentorLagbe</span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleDesktopSidebar}
            aria-label={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            aria-expanded={!collapsed}
            className="hidden shrink-0 rounded-lg p-2 text-white hover:bg-white/10 lg:inline-flex"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close dashboard menu"
            className="shrink-0 rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          {/* Dashboard Home */}
          <nav
            aria-label="Dashboard home navigation"
            className="mb-5"
          >
            <Link
              href="/dashboard"
              title="Dashboard Home"
              aria-label="Dashboard Home"
              aria-current={
                pathname === "/dashboard" ? "page" : undefined
              }
              onClick={closeMobileMenu}
              className={`flex min-h-11 items-center gap-3 rounded-xl py-3 text-sm font-semibold transition ${
                sidebarCollapsed
                  ? "justify-center px-2"
                  : "px-4"
              } ${
                pathname === "/dashboard"
                  ? "bg-[#ff8b63] text-[#14243a]"
                  : "text-[#c5d0da] hover:bg-white/10 hover:text-white"
              }`}
            >
              <LayoutDashboard
                size={20}
                className="shrink-0"
              />

              {!sidebarCollapsed && (
                <span>Dashboard Home</span>
              )}
            </Link>
          </nav>

          {/* Role-specific and account menus */}
          <DashboardNavigation
            role={role}
            collapsed={sidebarCollapsed}
            onNavigate={closeMobileMenu}
          />

          {/* Demo role selection */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <DashboardRoleSwitcher
              collapsed={sidebarCollapsed}
              onNavigate={closeMobileMenu}
            />
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <Link
            href="/"
            title="Back to Website"
            aria-label="Back to Website"
            onClick={closeMobileMenu}
            className={`flex min-h-11 items-center gap-3 rounded-xl py-3 text-sm font-semibold text-[#c5d0da] transition hover:bg-white/10 hover:text-white ${
              sidebarCollapsed
                ? "justify-center px-2"
                : "px-4"
            }`}
          >
            <ArrowLeft size={20} className="shrink-0" />

            {!sidebarCollapsed && (
              <span>Back to Website</span>
            )}
          </Link>
        </div>
      </aside>

      {/* Main dashboard */}
      <div className="min-w-0 flex-1">
        {/* Dashboard top bar */}
        <header className="flex min-h-20 items-center justify-between gap-3 border-b border-[#e6ebe7] bg-white px-4 py-4 sm:px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open dashboard menu"
              aria-controls="dashboard-sidebar"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="shrink-0 rounded-xl border border-[#e4e9e6] p-2.5 text-[#14243a] lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#84919c]">
                MentorLagbe / Dashboard
              </p>

              <h2 className="mt-1 truncate text-base font-extrabold text-[#14243a] sm:text-lg">
                {pageTitle}
              </h2>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-[#fff0e7] px-3 py-2 text-[11px] font-bold text-[#a85a3b] sm:px-4 sm:text-xs">
            Preview Mode
          </span>
        </header>

        {/* Dashboard page content */}
        <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-5 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
