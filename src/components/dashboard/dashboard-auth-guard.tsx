
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { ReactNode } from "react";

type UserRole = "student" | "tutor" | "admin";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthResponse = {
  success: boolean;
  user?: AuthUser;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const AUTH_KEY = "mentorlagbe_auth";

export function DashboardAuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAuthentication() {
      setAuthorized(false);

      const saved = sessionStorage.getItem(AUTH_KEY);

      if (!saved) {
        router.replace("/sign-in");
        return;
      }

      let token: string;

      try {
        const session = JSON.parse(saved) as {
          token?: string;
        };

        if (!session.token) {
          throw new Error("Missing token");
        }

        token = session.token;
      } catch {
        sessionStorage.removeItem(AUTH_KEY);
        router.replace("/sign-in");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          sessionStorage.removeItem(AUTH_KEY);
          router.replace("/sign-in");
          return;
        }

        if (!response.ok) {
          throw new Error("Authentication service unavailable");
        }

        const data =
          (await response.json()) as AuthResponse;

        if (
          !data.success ||
          !data.user ||
          !["student", "tutor", "admin"].includes(
            data.user.role
          )
        ) {
          sessionStorage.removeItem(AUTH_KEY);
          router.replace("/sign-in");
          return;
        }

        if (cancelled) {
          return;
        }

        const role = data.user.role;
        const ownDashboard = `/dashboard/${role}`;

        // Send the user to their own dashboard.
        if (
          pathname === "/dashboard" ||
          pathname === "/dashboard/"
        ) {
          router.replace(ownDashboard);
          return;
        }

        // Shared profile route for authenticated users.
        if (
          pathname === "/dashboard/profile" ||
          pathname.startsWith("/dashboard/profile/")
        ) {
          setAuthorized(true);
          return;
        }

        // Allow access to the user's own dashboard.
        if (
          pathname === ownDashboard ||
          pathname.startsWith(`${ownDashboard}/`)
        ) {
          setAuthorized(true);
          return;
        }

        // Redirect access to another role's dashboard.
        router.replace(ownDashboard);
      } catch {
        if (!cancelled) {
          // Network failure is not the same as an invalid token.
          // Keep the session, but do not expose the dashboard.
          setAuthorized(false);
        }
      }
    }

    void checkAuthentication();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f8f5] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#e5e9e7] border-t-[#14243a]" />

          <p className="text-sm font-semibold text-[#485669]">
            Checking dashboard access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
