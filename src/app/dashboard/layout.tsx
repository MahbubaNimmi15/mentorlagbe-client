
import type { ReactNode } from "react";
import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardAuthGuard } from "@/components/dashboard/dashboard-auth-guard";

// Disable instant-navigation validation for dashboard routes.
export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard",
  description: "MentorLagbe dashboard interface.",
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardAuthGuard>
      <DashboardShell>
        {children}
      </DashboardShell>
    </DashboardAuthGuard>
  );
}
