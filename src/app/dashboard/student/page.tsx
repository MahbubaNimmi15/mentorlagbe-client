
"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  RefreshCw,
  UserRound,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";

type Application = {
  id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
};

type AuthSession = {
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    plan?: "free" | "pro";
  };
};

type StudentApplicationsResponse = {
  success?: boolean;
  message?: string;
  applications?: Application[];
  stats?: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
  "http://localhost:5001";

export default function StudentDashboardPage() {
  const [authChecked, setAuthChecked] = useState(false);

  const [session, setSession] =
    useState<AuthSession | null>(null);

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get the existing login session.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(
        "mentorlagbe_auth"
      );

      if (saved) {
        setSession(JSON.parse(saved) as AuthSession);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  const isStudent =
    Boolean(session?.token) &&
    session?.user?.role === "student";

  // Fetch real student applications from MongoDB API.
  const loadDashboard = useCallback(
    async (signal?: AbortSignal) => {
      if (
        !session?.token ||
        session.user?.role !== "student"
      ) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/tuitions/student/my-applications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
            cache: "no-store",
            signal,
          }
        );

        const result =
          (await response.json()) as StudentApplicationsResponse;

        if (
          !response.ok ||
          !result.success ||
          !Array.isArray(result.applications)
        ) {
          throw new Error(
            result.message ||
              "Unable to load dashboard statistics."
          );
        }

        if (!signal?.aborted) {
          setApplications(result.applications);
        }
      } catch (err) {
        if (!signal?.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [session]
  );

  useEffect(() => {
    if (!authChecked || !isStudent) return;

    const controller = new AbortController();

    void loadDashboard(controller.signal);

    return () => controller.abort();
  }, [authChecked, isStudent, loadDashboard]);

  // Calculate statistics from real applications.
  const stats = useMemo(() => {
    return {
      total: applications.length,

      accepted: applications.filter(
        (item) => item.status === "accepted"
      ).length,

      pending: applications.filter(
        (item) => item.status === "pending"
      ).length,

      rejected: applications.filter(
        (item) => item.status === "rejected"
      ).length,
    };
  }, [applications]);

  // The current session may contain the user's plan.
  // Do not invent a plan when it is unavailable.
  const currentPlan =
    session?.user?.plan === "pro"
      ? "Pro"
      : session?.user?.plan === "free"
        ? "Free"
        : "N/A";

  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort((a, b) => {
          return (
            new Date(b.appliedAt).getTime() -
            new Date(a.appliedAt).getTime()
          );
        })
        .slice(0, 4),
    [applications]
  );

  // Checking authentication.
  if (!authChecked) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-[#e97c53]"
        />

        <p className="mt-4 text-sm text-[#71808c]">
          Checking your account...
        </p>
      </div>
    );
  }

  // Only students can view this dashboard.
  if (!isStudent) {
    return (
      <div className="py-20 text-center">
        <UserRound
          size={42}
          className="mx-auto text-[#e97c53]"
        />

        <h1 className="mt-5 text-2xl font-extrabold">
          Student Login Required
        </h1>

        <p className="mt-3 text-sm text-[#71808c]">
          Please sign in with your Student account.
        </p>

        <Link
          href="/sign-in"
          className="mt-6 inline-flex rounded-xl bg-[#14243a] px-6 py-3 text-sm font-bold text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-[#347457]">
            STUDENT OVERVIEW
          </span>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">
            Your learning space.
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#71808c]">
            Welcome back
            {session?.user?.name
              ? `, ${session.user.name}`
              : ""}
            . Track your real tuition applications
            and learning journey.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e1] bg-white px-5 py-3 text-sm font-bold text-[#526275] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/dashboard/student/my-applications"
            className="btn-primary"
          >
            My Applications
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* API Error */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5"
        >
          <div className="flex items-center gap-2 font-bold text-red-700">
            <AlertCircle size={20} />
            Dashboard Data Error
          </div>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-4 rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading Indicator */}

      {loading && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl bg-[#f7faf7] p-4 text-sm text-[#647487]"
        >
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading your dashboard statistics...
        </div>
      )}

      {/* Real Statistics */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={
            loading || error
              ? "—"
              : String(stats.total)
          }
          description="Total tuition applications"
          icon={<BookOpen size={23} />}
          accent="blue"
        />

        <StatCard
          title="Accepted"
          value={
            loading || error
              ? "—"
              : String(stats.accepted)
          }
          description="Applications accepted by tutors"
          icon={<CheckCircle2 size={23} />}
          accent="green"
        />

        <StatCard
          title="Pending"
          value={
            loading || error
              ? "—"
              : String(stats.pending)
          }
          description="Waiting for tutor response"
          icon={<Clock3 size={23} />}
          accent="orange"
        />

        <StatCard
          title="Current Plan"
          value={currentPlan}
          description={
            currentPlan === "N/A"
              ? "Plan not available in login session"
              : "Your subscription plan"
          }
          icon={<GraduationCap size={23} />}
          accent="purple"
        />
      </div>

      {/* Dashboard Content */}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[25px] border border-[#e6ebe7] bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">
              Application Management
            </h2>

            <span className="rounded-full bg-[#e3f4e8] px-3 py-1.5 text-xs font-bold text-[#347457]">
              Real Applications
            </span>
          </div>

          {!loading &&
            !error &&
            applications.length === 0 && (
              <div className="mt-8 rounded-2xl bg-[#f7faf7] px-5 py-12 text-center">
                <BookOpen
                  size={35}
                  className="mx-auto text-[#819b8e]"
                />

                <h3 className="mt-5 text-lg font-extrabold">
                  No Applications Yet
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#72808c]">
                  You have not applied for any tuition.
                  Browse available opportunities
                  to start your learning journey.
                </p>

                <Link
                  href="/tuitions"
                  className="btn-primary mt-6"
                >
                  Browse Tuitions
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            )}

          {!loading &&
            !error &&
            recentApplications.length > 0 && (
              <div className="mt-7 space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e6ebe7] p-5"
                  >
                    <div>
                      <p className="font-bold text-[#14243a]">
                        {application.tuitionTitle}
                      </p>

                      <p className="mt-2 text-xs text-[#72808c]">
                        {application.subject}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-2 text-xs font-bold capitalize ${
                        application.status === "accepted"
                          ? "bg-green-50 text-green-700"
                          : application.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                ))}

                <Link
                  href="/dashboard/student/my-applications"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#e97c53]"
                >
                  View All Applications
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            )}
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
