

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast-provider";

type ApprovalStatus = "pending" | "approved" | "rejected";
type StatusFilter = ApprovalStatus | "all";
type ActionType = "approve" | "reject";

type Tuition = {
  id: string;
  title: string;
  tutorId: string;
  subject: string;
  classLevel: string;
  location: string;
  salary: number;
  requirements?: string;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
};

type TuitionResponse = {
  success: boolean;
  total?: number;
  tuitions: Tuition[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const statusColors: Record<ApprovalStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMoney(value: number) {
  return `BDT ${Number(value).toLocaleString("en-BD")}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getToken() {
  const saved = sessionStorage.getItem("mentorlagbe_auth");

  if (!saved) {
    throw new Error("Please sign in as an admin.");
  }

  try {
    const session = JSON.parse(saved) as {
      token?: string;
    };

    if (!session.token) {
      throw new Error("Missing authentication token");
    }

    return session.token;
  } catch {
    throw new Error(
      "Invalid session. Please sign in again."
    );
  }
}

async function getErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as {
      message?: string;
    };

    return (
      data.message ||
      `Request failed (${response.status})`
    );
  } catch {
    return `Request failed (${response.status})`;
  }
}

export default function AdminTuitionsPage() {
  const toast = useToast();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [confirmation, setConfirmation] = useState<{
    id: string;
    action: ActionType;
  } | null>(null);

  const [processing, setProcessing] = useState(false);

  // Load tuition records from MongoDB API
  useEffect(() => {
    const controller = new AbortController();

    async function loadTuitions() {
      setLoading(true);
      setError("");

      try {
        const token = getToken();

        const response = await fetch(
          `${API_URL}/api/tuitions/admin/all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(
              "Access denied. An admin account is required."
            );
          }

          throw new Error(
            await getErrorMessage(response)
          );
        }

        const data =
          (await response.json()) as TuitionResponse;

        if (
          !data.success ||
          !Array.isArray(data.tuitions)
        ) {
          throw new Error("Invalid tuition response.");
        }

        if (!controller.signal.aborted) {
          setTuitions(data.tuitions);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setTuitions([]);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load tuition records."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTuitions();

    return () => controller.abort();
  }, [refreshKey]);

  const selectedTuition = tuitions.find(
    (tuition) => tuition.id === selectedId
  );

  const confirmationTuition = tuitions.find(
    (tuition) => tuition.id === confirmation?.id
  );

  const stats = useMemo(
    () => ({
      total: tuitions.length,
      pending: tuitions.filter(
        (tuition) => tuition.status === "pending"
      ).length,
      approved: tuitions.filter(
        (tuition) => tuition.status === "approved"
      ).length,
      rejected: tuitions.filter(
        (tuition) => tuition.status === "rejected"
      ).length,
    }),
    [tuitions]
  );

  const filteredTuitions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const matchesSearch = [
        tuition.id,
        tuition.title,
        tuition.tutorId,
        tuition.subject,
        tuition.classLevel,
        tuition.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        tuition.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tuitions, search, statusFilter]);

  function refreshTuitions() {
    setRefreshKey((current) => current + 1);
  }

  // Handles BOTH Approve and Reject
  async function confirmAction() {
    if (!confirmation || processing) return;

    const { id, action } = confirmation;

    const tuition = tuitions.find(
      (item) => item.id === id
    );

    if (!tuition || tuition.status !== "pending") {
      setConfirmation(null);
      return;
    }

    setProcessing(true);

    try {
      const token = getToken();

      const endpoint =
        action === "approve" ? "approve" : "reject";

      const response = await fetch(
        `${API_URL}/api/tuitions/${id}/${endpoint}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response)
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        tuition?: Tuition;
        message?: string;
      };

      if (!result.success) {
        throw new Error(
          result.message || "Action failed."
        );
      }

      if (result.tuition) {
        const updatedTuition = result.tuition;

        setTuitions((previous) =>
          previous.map((item) =>
            item.id === id ? updatedTuition : item
          )
        );
      }

      setConfirmation(null);

      if (action === "approve") {
        toast.success({
          title: "Tuition Approved",
          description: `"${tuition.title}" was approved successfully.`,
        });
      } else {
        toast.success({
          title: "Tuition Rejected",
          description: `"${tuition.title}" was rejected successfully.`,
        });
      }

      refreshTuitions();
    } catch (err) {
      toast.error({
        title:
          action === "approve"
            ? "Approval Failed"
            : "Rejection Failed",
        description:
          err instanceof Error
            ? err.message
            : "Unable to update tuition.",
      });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* HEADER */}

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              <ArrowLeft size={17} />
              Admin Overview
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#e97c53]">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#14243a]">
              Tuition Approval
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Review, approve and reject tuition submissions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            <ShieldCheck size={18} />
            MongoDB Management
          </div>
        </header>

        {/* INFORMATION */}

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <strong>Real Tuition Data:</strong>{" "}
          Tuition submissions are loaded from MongoDB.
          Pending listings can be approved or rejected.
          Only approved and active listings appear in
          the public Tuition API.
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* STATISTICS */}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Approved", value: stats.approved },
            { label: "Rejected", value: stats.rejected },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-500">
                {item.label}
              </p>

              <p className="mt-4 text-3xl font-extrabold text-[#14243a]">
                {loading
                  ? "..."
                  : error
                    ? "N/A"
                    : item.value}
              </p>
            </article>
          ))}
        </section>

        {/* LISTINGS */}

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Tuition Submissions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading submissions..."
                  : `Showing ${filteredTuitions.length} of ${tuitions.length} records`}
              </p>
            </div>

            <button
              type="button"
              disabled={loading || processing}
              onClick={refreshTuitions}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Refresh Data
            </button>
          </div>

          {/* FILTERS */}

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div className="relative">
              <label
                htmlFor="tuition-search"
                className="sr-only"
              >
                Search tuition listings
              </label>

              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-3.5 text-slate-400"
              />

              <input
                id="tuition-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search tuition, tutor ID, subject..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#e97c53]"
              />
            </div>

            <div>
              <label
                htmlFor="tuition-status"
                className="sr-only"
              >
                Filter tuition status
              </label>

              <select
                id="tuition-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#e97c53]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* TUITION CARDS */}

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                Loading tuition submissions...
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-red-50 p-10 text-center">
                <p className="font-bold text-red-700">
                  Unable to load tuition records.
                </p>

                <button
                  type="button"
                  onClick={refreshTuitions}
                  className="mt-4 rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : filteredTuitions.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <h3 className="font-bold text-[#14243a]">
                  No tuition submissions found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search or status filter.
                </p>
              </div>
            ) : (
              filteredTuitions.map((tuition) => (
                <article
                  key={tuition.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-orange-200"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            statusColors[tuition.status] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tuition.status}
                        </span>

                        <span className="break-all text-xs text-slate-400">
                          {tuition.id}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-extrabold text-[#14243a]">
                        {tuition.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {tuition.subject} |{" "}
                        {tuition.classLevel}
                      </p>

                      <p className="mt-2 break-all text-sm text-slate-500">
                        Tutor ID:{" "}
                        <span className="font-semibold">
                          {tuition.tutorId}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {tuition.location}
                      </p>

                      <p className="mt-3 text-sm font-bold text-[#14243a]">
                        {formatMoney(tuition.salary)}
                        <span className="font-normal text-slate-500">
                          {" "}/ month
                        </span>
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Submitted{" "}
                        {formatDate(tuition.createdAt)}
                      </p>
                    </div>

                    {/* BUTTONS */}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedId(tuition.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye size={15} />
                        Details
                      </button>

                      {tuition.status === "pending" && (
                        <>
                          {/* APPROVE */}

                          <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                              setConfirmation({
                                id: tuition.id,
                                action: "approve",
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle2 size={15} />
                            Approve
                          </button>

                          {/* REJECT - NOW ACTIVE */}

                          <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                              setConfirmation({
                                id: tuition.id,
                                action: "reject",
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {tuition.requirements && (
                    <p className="mt-4 whitespace-pre-wrap border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">
                      {tuition.requirements}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>

        {/* DETAILS MODAL */}

        {selectedTuition && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#14243a]/70 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="tuition-details-heading"
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <h2
                  id="tuition-details-heading"
                  className="text-xl font-extrabold text-[#14243a]"
                >
                  Tuition Details
                </h2>

                <button
                  type="button"
                  aria-label="Close tuition details"
                  onClick={() => setSelectedId(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Tuition ID", selectedTuition.id],
                  ["Title", selectedTuition.title],
                  ["Tutor ID", selectedTuition.tutorId],
                  ["Subject", selectedTuition.subject],
                  ["Class Level", selectedTuition.classLevel],
                  ["Location", selectedTuition.location],
                  [
                    "Monthly Salary",
                    formatMoney(selectedTuition.salary),
                  ],
                  [
                    "Status",
                    capitalize(selectedTuition.status),
                  ],
                  [
                    "Submitted",
                    formatDate(selectedTuition.createdAt),
                  ],
                  [
                    "Requirements",
                    selectedTuition.requirements || "N/A",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border-b border-slate-100 pb-3"
                  >
                    <p className="text-xs font-bold text-slate-400">
                      {label}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium leading-6 text-[#14243a]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="mt-6 w-full rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
              >
                Close Details
              </button>
            </section>
          </div>
        )}

        {/* APPROVE / REJECT CONFIRMATION */}

        <ConfirmDialog
          open={Boolean(confirmationTuition && confirmation)}
          title={
            confirmation?.action === "reject"
              ? "Reject Tuition?"
              : "Approve Tuition?"
          }
          description={
            confirmation?.action === "reject"
              ? "This tuition will be marked as rejected in MongoDB and will not appear in public listings."
              : "This tuition will be approved in MongoDB and can appear in public listings when active."
          }
          confirmLabel={
            processing
              ? "Processing..."
              : confirmation?.action === "reject"
                ? "Reject Tuition"
                : "Approve Tuition"
          }
          variant={
            confirmation?.action === "reject"
              ? "danger"
              : "info"
          }
          onConfirm={() => {
            if (!processing) {
              void confirmAction();
            }
          }}
          onCancel={() => {
            if (!processing) {
              setConfirmation(null);
            }
          }}
        >
          <p className="font-bold">
            {confirmationTuition?.title}
          </p>
        </ConfirmDialog>
      </div>
    </main>
  );
}
