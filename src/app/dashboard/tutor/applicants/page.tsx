
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  UserRound,
  XCircle,
} from "lucide-react";

type Status = "pending" | "accepted" | "rejected";

type Application = {
  id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote?: string;
  status: Status;
  appliedAt: string;
};

type AuthSession = {
  token?: string;
  user?: {
    role?: string;
  };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

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

function formatFee(value: number) {
  return `BDT ${Number(value).toLocaleString("en-BD")}`;
}

export default function TutorApplicantsPage() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [updatingId, setUpdatingId] = useState<
    string | null
  >(null);

  const [filter, setFilter] = useState<
    "all" | Status
  >("all");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(
        "mentorlagbe_auth"
      );

      if (saved) {
        const session = JSON.parse(
          saved
        ) as AuthSession;

        setToken(session.token || "");
        setRole(session.user?.role || "");
      }
    } catch {
      setToken("");
      setRole("");
    } finally {
      setAuthChecked(true);
    }
  }, []);

  const loadApplications = useCallback(async () => {
    if (!token || role !== "tutor") {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/tuitions/my/applications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        applications?: Application[];
      };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load applicants"
        );
      }

      setApplications(
        Array.isArray(data.applications)
          ? data.applications
          : []
      );
    } catch (err) {
      setApplications([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load applicants"
      );
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  async function updateStatus(
    application: Application,
    status: "accepted" | "rejected"
  ) {
    if (
      !token ||
      updatingId ||
      application.status !== "pending"
    ) {
      return;
    }

    const action =
      status === "accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} the application from ${application.studentName}?`
    );

    if (!confirmed) {
      return;
    }

    setUpdatingId(application.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/tuitions/my/applications/${application.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        application?: Application;
      };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Status update failed"
        );
      }

      if (data.application) {
        setApplications((previous) =>
          previous.map((item) =>
            item.id === application.id
              ? data.application!
              : item
          )
        );
      } else {
        await loadApplications();
      }

      setMessage(
        data.message ||
          `Application ${status} successfully`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update application"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const stats = {
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
  };

  const visible = applications.filter(
    (item) =>
      filter === "all" || item.status === filter
  );

  if (!authChecked) {
    return (
      <main className="site-container py-20 text-center">
        <Loader2
          className="mx-auto animate-spin"
          size={30}
        />
        <p className="mt-4">Checking account...</p>
      </main>
    );
  }

  if (!token || role !== "tutor") {
    return (
      <main className="site-container min-h-[60vh] py-20 text-center">
        <UserRound
          size={42}
          className="mx-auto text-[#e97c53]"
        />

        <h1 className="mt-5 text-2xl font-extrabold">
          Tutor Login Required
        </h1>

        <p className="mt-3 text-[#647487]">
          Please sign in with a Tutor account to
          manage student applications.
        </p>

        <Link
          href="/sign-in"
          className="mt-6 inline-flex rounded-xl bg-[#14243a] px-6 py-3 font-bold text-white"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="site-container min-h-screen py-10 md:py-14">
      <Link
        href="/dashboard/tutor"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#647487] hover:text-[#d97750]"
      >
        <ArrowLeft size={17} />
        Tutor Dashboard
      </Link>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[2px] text-[#d97750]">
            Tutor Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#14243a] md:text-4xl">
            Manage Applicants
          </h1>

          <p className="mt-3 text-sm text-[#647487]">
            Review applications submitted for your
            tuition listings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadApplications()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e1] bg-white px-5 py-3 text-sm font-bold disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* STATISTICS */}

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Applications",
            value: stats.total,
          },
          {
            label: "Pending",
            value: stats.pending,
          },
          {
            label: "Accepted",
            value: stats.accepted,
          },
          {
            label: "Rejected",
            value: stats.rejected,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[22px] border border-[#e7ebe8] bg-white p-6"
          >
            <p className="text-sm font-semibold text-[#718190]">
              {item.label}
            </p>

            <p className="mt-3 text-3xl font-extrabold text-[#14243a]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* MESSAGES */}

      {error && (
        <div
          role="alert"
          className="mt-7 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {message}
        </div>
      )}

      {/* FILTER */}

      <div className="mt-9 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["pending", "Pending"],
            ["accepted", "Accepted"],
            ["rejected", "Rejected"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              filter === value
                ? "bg-[#14243a] text-white"
                : "border border-[#e7ebe8] bg-white text-[#627181] hover:bg-[#f7faf7]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* LOADING */}

      {loading && (
        <div className="mt-8 flex items-center gap-3 rounded-xl bg-white p-6 text-[#647487]">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading applicants...
        </div>
      )}

      {/* EMPTY STATE */}

      {!loading && !error && visible.length === 0 && (
        <div className="mt-8 rounded-[24px] border border-dashed border-[#d4ded9] bg-white px-6 py-16 text-center">
          <UserRound
            size={38}
            className="mx-auto text-[#829b92]"
          />

          <h2 className="mt-4 text-xl font-extrabold">
            No Applications Found
          </h2>

          <p className="mt-2 text-sm text-[#718190]">
            No student applications match this filter.
          </p>
        </div>
      )}

      {/* APPLICATION CARDS */}

      {!loading && (
        <div className="mt-8 grid gap-6">
          {visible.map((application) => (
            <article
              key={application.id}
              className="rounded-[24px] border border-[#e7ebe8] bg-white p-6 shadow-[0_12px_35px_rgba(20,36,58,.04)] md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#14243a]">
                    {application.studentName}
                  </h2>

                  <p className="mt-2 text-sm font-semibold text-[#647487]">
                    Applied for:{" "}
                    {application.tuitionTitle}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${
                    application.status === "accepted"
                      ? "bg-emerald-100 text-emerald-700"
                      : application.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {application.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 text-sm text-[#627181] md:grid-cols-2">
                <p className="flex items-center gap-2">
                  <Mail size={17} />
                  <span className="break-all">
                    {application.studentEmail}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={17} />
                  {application.studentPhone}
                </p>

                <p className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {application.preferredSchedule}
                </p>

                <p className="flex items-center gap-2">
                  <CheckCircle2 size={17} />
                  Applied:{" "}
                  {formatDate(application.appliedAt)}
                </p>
              </div>

              <div className="mt-6 rounded-xl bg-[#f7faf7] p-4">
                <p className="text-xs font-bold text-[#718190]">
                  Tuition Information
                </p>

                <p className="mt-2 text-sm font-semibold text-[#14243a]">
                  {application.subject} ·{" "}
                  {formatFee(application.monthlyFee)}
                  /month
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-[#fff9f0] p-4">
                <p className="text-xs font-bold text-[#718190]">
                  Student Learning Note
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#526275]">
                  {application.studentNote ||
                    "No learning note provided."}
                </p>
              </div>

              {application.status === "pending" && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={updatingId !== null}
                    onClick={() =>
                      void updateStatus(
                        application,
                        "accepted"
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#348265] px-6 py-3 text-sm font-bold text-white hover:bg-[#286c52] disabled:opacity-50"
                  >
                    {updatingId === application.id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <CheckCircle2 size={17} />
                    )}
                    Accept
                  </button>

                  <button
                    type="button"
                    disabled={updatingId !== null}
                    onClick={() =>
                      void updateStatus(
                        application,
                        "rejected"
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle size={17} />
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
