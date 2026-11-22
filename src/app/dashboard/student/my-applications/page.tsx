
"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

type Application = {
  id: string;
  tuitionId: string;
  tuitionTitle: string;
  tutorName: string;
  subject: string;
  monthlyFee: number;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  appliedAt: string;
  updatedAt: string;
  status: ApplicationStatus;
};

type AuthSession = {
  token?: string;
  user?: {
    id?: string;
    name?: string;
    role?: string;
  };
};

type ApplicationsResponse = {
  success?: boolean;
  message?: string;
  applications?: Application[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const statusStyles: Record<
  ApplicationStatus,
  string
> = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

function formatMoney(amount: number) {
  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SummaryCard({
  label,
  value,
  icon,
  background,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  background: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[22px] border border-[#e6ebe7] bg-white p-6">
      <div>
        <p className="text-sm font-semibold text-[#72808c]">
          {label}
        </p>

        <p className="mt-3 text-3xl font-extrabold">
          {value}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${background}`}
      >
        {icon}
      </div>
    </div>
  );
}

export default function MyApplicationsPage() {
  const [authChecked, setAuthChecked] =
    useState(false);

  const [session, setSession] =
    useState<AuthSession | null>(null);

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  // Read real student login session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(
        "mentorlagbe_auth"
      );

      if (saved) {
        const parsed = JSON.parse(
          saved
        ) as AuthSession;

        setSession(parsed);
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

  // Load applications from MongoDB API
  const loadApplications = useCallback(
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
          (await response.json()) as ApplicationsResponse;

        if (
          !response.ok ||
          !result.success ||
          !Array.isArray(result.applications)
        ) {
          throw new Error(
            result.message ||
              "Unable to load applications."
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
              : "Unable to load applications."
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
    if (!authChecked || !isStudent) {
      return;
    }

    const controller = new AbortController();

    void loadApplications(controller.signal);

    return () => controller.abort();
  }, [authChecked, isStudent, loadApplications]);

  const stats = useMemo(
    () => ({
      total: applications.length,

      pending: applications.filter(
        (item) => item.status === "pending"
      ).length,

      accepted: applications.filter(
        (item) => item.status === "accepted"
      ).length,

      rejected: applications.filter(
        (item) => item.status === "rejected"
      ).length,
    }),
    [applications]
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return applications.filter((application) => {
      const searchable = [
        application.tuitionTitle,
        application.subject,
        application.tutorName,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchable.includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // Checking session
  if (!authChecked) {
    return (
      <div className="py-20 text-center">
        <Loader2
          size={30}
          className="mx-auto animate-spin text-[#e97c53]"
        />

        <p className="mt-4 text-[#71808c]">
          Checking student account...
        </p>
      </div>
    );
  }

  // Student account required
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

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#71808c]">
          Please sign in with your Student account
          to track your tuition applications.
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
      {/* PAGE HEADER */}

      <div>
        <Link
          href="/dashboard/student"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#6b7a88] hover:text-[#e97c53]"
        >
          <ArrowLeft size={17} />
          Student Overview
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-[#347457]">
              STUDENT APPLICATIONS
            </span>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">
              My Applications
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71808c]">
              Track your real tuition applications and
              review the latest decisions from tutors.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadApplications()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e1] bg-white px-5 py-3 text-sm font-bold text-[#526275] disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

            <Link
              href="/tuitions"
              className="btn-primary"
            >
              Find Tuitions
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>

      {/* REAL APPLICATION STATISTICS */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Applied"
          value={stats.total}
          icon={<BookOpen size={22} />}
          background="bg-[#e7f0ff]"
        />

        <SummaryCard
          label="Accepted"
          value={stats.accepted}
          icon={<CheckCircle2 size={22} />}
          background="bg-[#e3f4e8]"
        />

        <SummaryCard
          label="Pending"
          value={stats.pending}
          icon={<Clock3 size={22} />}
          background="bg-[#fff0e7]"
        />

        <SummaryCard
          label="Rejected"
          value={stats.rejected}
          icon={<XCircle size={22} />}
          background="bg-red-50"
        />
      </div>

      {/* APPLICATION TABLE */}

      <section className="rounded-[24px] border border-[#e6ebe7] bg-white p-5 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row">
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold text-[#526275]">
              Search applications
            </span>

            <div className="flex items-center gap-3 rounded-xl border border-[#dce4e1] px-4">
              <Search
                size={18}
                className="text-[#82909b]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search title, tutor or subject"
                className="h-12 w-full min-w-0 bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <label className="md:w-56">
            <span className="mb-2 block text-xs font-bold text-[#526275]">
              Application status
            </span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-12 w-full rounded-xl border border-[#dce4e1] bg-white px-4 text-sm outline-none"
            >
              <option value="all">
                All statuses
              </option>
              <option value="pending">
                Pending
              </option>
              <option value="accepted">
                Accepted
              </option>
              <option value="rejected">
                Rejected
              </option>
            </select>
          </label>
        </div>

        {/* API ERROR */}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-red-700">
              <AlertCircle size={18} />
              Unable to load applications
            </div>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadApplications()}
              className="mt-4 rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING STATE */}

        {loading && (
          <div className="mt-7 flex items-center gap-3 rounded-xl bg-[#f7faf7] p-5 text-sm text-[#647487]">
            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading your applications...
          </div>
        )}

        {/* REAL APPLICATIONS */}

        {!loading && !error && (
          <>
            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead>
                  <tr className="border-b border-[#e6ebe7] text-xs uppercase tracking-wide text-[#778592]">
                    <th className="px-3 py-4">
                      Tuition
                    </th>
                    <th className="px-3 py-4">
                      Tutor
                    </th>
                    <th className="px-3 py-4">
                      Fee
                    </th>
                    <th className="px-3 py-4">
                      Applied
                    </th>
                    <th className="px-3 py-4">
                      Status
                    </th>
                    <th className="px-3 py-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((application) => (
                    <tr
                      key={application.id}
                      className="border-b border-[#edf0ed] text-sm"
                    >
                      <td className="px-3 py-5">
                        <p className="font-bold text-[#14243a]">
                          {application.tuitionTitle}
                        </p>

                        <p className="mt-2 text-xs text-[#7d8a94]">
                          {application.subject}
                        </p>
                      </td>

                      <td className="px-3 py-5">
                        <p className="font-semibold">
                          {application.tutorName ||
                            "Registered Tutor"}
                        </p>
                      </td>

                      <td className="px-3 py-5 font-bold">
                        {formatMoney(
                          application.monthlyFee
                        )}
                      </td>

                      <td className="px-3 py-5">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={15} />

                          {formatDate(
                            application.appliedAt
                          )}
                        </span>
                      </td>

                      <td className="px-3 py-5">
                        <span
                          className={`rounded-full px-3 py-2 text-xs font-bold capitalize ${
                            statusStyles[
                              application.status
                            ] || statusStyles.pending
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td className="px-3 py-5 text-right">
                        <Link
                          href={`/tuitions/${application.tuitionId}`}
                          className="inline-flex items-center gap-1 rounded-xl border border-[#dce4e1] px-3 py-2 text-xs font-bold text-[#14243a] hover:bg-[#f7faf7]"
                        >
                          View Tuition
                          <ArrowUpRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <BookOpen
                    size={35}
                    className="mx-auto text-[#91a29a]"
                  />

                  <h3 className="mt-5 text-lg font-extrabold">
                    No Applications Found
                  </h3>

                  <p className="mt-2 text-sm text-[#74828d]">
                    {applications.length === 0
                      ? "You have not applied for any tuition yet."
                      : "Try another search or status filter."}
                  </p>

                  {applications.length === 0 && (
                    <Link
                      href="/tuitions"
                      className="mt-5 inline-flex rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
                    >
                      Browse Tuitions
                    </Link>
                  )}
                </div>
              )}
            </div>

            <p className="mt-5 text-xs text-[#83919b]">
              Showing {filtered.length} of{" "}
              {applications.length} real applications
            </p>
          </>
        )}
      </section>

      <p className="text-xs leading-6 text-[#83919b]">
        Application statuses are updated by tutors.
        Use Refresh to retrieve the latest status
        from the server. Application withdrawal is not
        available yet.
      </p>
    </div>
  );
}
