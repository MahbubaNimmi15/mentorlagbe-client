
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

type ApprovalStatus = "pending" | "approved" | "rejected";
type StatusFilter = "all" | ApprovalStatus;
type TuitionMode = "Online" | "Offline";

type Tuition = {
  id: string;
  title: string;
  tutorName: string;
  tutorEmail: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  createdAt: string;
};

const initialTuitions: Tuition[] = [
  {
    id: "TUI-201",
    title: "SSC Mathematics Complete Preparation",
    tutorName: "Ayesha Rahman",
    tutorEmail: "ayesha@example.com",
    subject: "Mathematics",
    classLevel: "Class 9 - 10",
    mode: "Offline",
    location: "Dhanmondi, Dhaka",
    monthlyFee: 5000,
    daysPerWeek: 3,
    description:
      "Structured mathematics lessons for SSC candidates, including algebra, geometry, weekly assessments and board examination preparation.",
    approvalStatus: "pending",
    isActive: true,
    createdAt: "2026-11-17",
  },
  {
    id: "TUI-202",
    title: "Spoken English and Grammar Course",
    tutorName: "Tanvir Hasan",
    tutorEmail: "tanvir@example.com",
    subject: "English",
    classLevel: "Class 6 - 8",
    mode: "Online",
    location: "Anywhere in Bangladesh",
    monthlyFee: 3500,
    daysPerWeek: 4,
    description:
      "Develop spoken English confidence through regular conversation, grammar practice, vocabulary building and guided speaking exercises.",
    approvalStatus: "pending",
    isActive: true,
    createdAt: "2026-11-16",
  },
  {
    id: "TUI-203",
    title: "HSC Physics Concept Builder",
    tutorName: "Mahmud Islam",
    tutorEmail: "mahmud@example.com",
    subject: "Physics",
    classLevel: "HSC",
    mode: "Offline",
    location: "Uttara, Dhaka",
    monthlyFee: 6000,
    daysPerWeek: 3,
    description:
      "Build strong HSC physics fundamentals with numerical problem solving, practical examples, exam-focused revision and mock tests.",
    approvalStatus: "approved",
    isActive: true,
    createdAt: "2026-11-14",
  },
  {
    id: "TUI-204",
    title: "Programming Fundamentals for Beginners",
    tutorName: "Nabila Ahmed",
    tutorEmail: "nabila@example.com",
    subject: "Programming",
    classLevel: "University",
    mode: "Online",
    location: "Online",
    monthlyFee: 4500,
    daysPerWeek: 2,
    description:
      "Learn programming concepts through beginner-friendly lessons, Python fundamentals, practice exercises and hands-on projects.",
    approvalStatus: "approved",
    isActive: true,
    createdAt: "2026-11-13",
  },
  {
    id: "TUI-205",
    title: "IELTS Intensive Coaching Program",
    tutorName: "Farhan Kabir",
    tutorEmail: "farhan@example.com",
    subject: "IELTS",
    classLevel: "IELTS",
    mode: "Online",
    location: "Online",
    monthlyFee: 7000,
    daysPerWeek: 4,
    description:
      "Focused IELTS preparation covering listening, reading, writing and speaking with regular practice and feedback.",
    approvalStatus: "rejected",
    isActive: false,
    createdAt: "2026-11-11",
  },
];

const statusColors: Record<ApprovalStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

function formatMoney(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminTuitionApprovalPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>(() =>
    initialTuitions.map((item) => ({ ...item }))
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [selectedTuitionId, setSelectedTuitionId] =
    useState<string | null>(null);

  const [confirmation, setConfirmation] = useState<{
    tuitionId: string;
    nextStatus: "approved" | "rejected";
  } | null>(null);

  const [notice, setNotice] = useState("");

  const stats = useMemo(
    () => ({
      total: tuitions.length,
      pending: tuitions.filter(
        (item) => item.approvalStatus === "pending"
      ).length,
      approved: tuitions.filter(
        (item) => item.approvalStatus === "approved"
      ).length,
      rejected: tuitions.filter(
        (item) => item.approvalStatus === "rejected"
      ).length,
    }),
    [tuitions]
  );

  const filteredTuitions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const searchableText = [
        tuition.id,
        tuition.title,
        tuition.tutorName,
        tuition.tutorEmail,
        tuition.subject,
        tuition.classLevel,
        tuition.location,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        tuition.approvalStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tuitions, search, statusFilter]);

  const selectedTuition = selectedTuitionId
    ? tuitions.find(
        (item) => item.id === selectedTuitionId
      )
    : null;

  const confirmationTuition = confirmation
    ? tuitions.find(
        (item) => item.id === confirmation.tuitionId
      )
    : null;

  function requestApproval(
    tuitionId: string,
    nextStatus: "approved" | "rejected"
  ) {
    const tuition = tuitions.find(
      (item) => item.id === tuitionId
    );

    if (!tuition) return;
    if (tuition.approvalStatus === nextStatus) return;

    setNotice("");
    setConfirmation({ tuitionId, nextStatus });
  }

  function confirmApproval() {
    if (!confirmation || !confirmationTuition) return;

    const tuitionTitle = confirmationTuition.title;
    const nextStatus = confirmation.nextStatus;

    setTuitions((current) =>
      current.map((tuition) => {
        if (tuition.id !== confirmation.tuitionId) {
          return tuition;
        }

        return {
          ...tuition,
          approvalStatus: nextStatus,
          isActive:
            nextStatus === "rejected"
              ? false
              : tuition.isActive,
        };
      })
    );

    setConfirmation(null);
    setSelectedTuitionId(null);

    setNotice(
      `"${tuitionTitle}" was ${nextStatus} in Demo Mode. No database was updated.`
    );
  }

  function resetDemo() {
    setTuitions(
      initialTuitions.map((item) => ({ ...item }))
    );
    setSearch("");
    setStatusFilter("all");
    setSelectedTuitionId(null);
    setConfirmation(null);
    setNotice("Original demo tuition records restored.");
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
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

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review tutor submissions and manage approval status.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
            <ShieldCheck size={18} />
            Demo Mode
          </div>
        </header>

        {/* Demo information */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Demo Data Only:</strong> These tuition
          records are fictional. Approve and Reject
          buttons update the current page only.
          Refreshing restores the original records.
          Real approval requires authentication,
          MongoDB and protected Admin APIs.
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Tuitions",
              value: stats.total,
              icon: BookOpen,
              tone: "bg-blue-50 text-blue-700",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock3,
              tone: "bg-amber-50 text-amber-700",
            },
            {
              label: "Approved",
              value: stats.approved,
              icon: CheckCircle2,
              tone: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              icon: XCircle,
              tone: "bg-red-50 text-red-700",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${stat.tone}`}
                >
                  <Icon size={21} />
                </div>

                <p className="text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#14243a]">
                  {stat.value}
                </p>
              </article>
            );
          })}
        </section>

        {/* Listings section */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Tuition Submissions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredTuitions.length} of{" "}
                {tuitions.length} sample listings
              </p>
            </div>

            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset Demo
            </button>
          </div>

          {notice && (
            <div
              role="status"
              className="mt-5 rounded-xl bg-[#e3f4e8] p-4 text-sm font-medium text-emerald-900"
            >
              {notice}
            </div>
          )}

          {/* Search + Filter */}
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-3.5 text-slate-400"
              />

              <label htmlFor="tuition-search" className="sr-only">
                Search tuition submissions
              </label>

              <input
                id="tuition-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search title, subject, tutor..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#e97c53]"
              />
            </div>

            <div>
              <label htmlFor="approval-filter" className="sr-only">
                Filter approval status
              </label>

              <select
                id="approval-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#e97c53]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Tuition cards */}
          <div className="mt-6 space-y-4">
            {filteredTuitions.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <p className="text-3xl">📚</p>

                <h3 className="mt-3 font-bold text-[#14243a]">
                  No tuition submissions found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing the search or approval filter.
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
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[tuition.approvalStatus]}`}
                        >
                          {capitalize(tuition.approvalStatus)}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            tuition.isActive
                              ? "bg-slate-100 text-slate-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {tuition.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <span className="text-xs text-slate-400">
                          {tuition.id}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-extrabold text-[#14243a]">
                        {tuition.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {tuition.subject} · {tuition.classLevel}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Tutor:{" "}
                        <span className="font-semibold text-slate-700">
                          {tuition.tutorName}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {tuition.mode} · {tuition.location}
                      </p>

                      <p className="mt-3 text-sm font-bold text-[#14243a]">
                        {formatMoney(tuition.monthlyFee)}
                        <span className="font-normal text-slate-500">
                          {" "}/ month ·{" "}
                          {tuition.daysPerWeek} days/week
                        </span>
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Submitted{" "}
                        {formatDate(tuition.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTuitionId(tuition.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye size={15} />
                        Details
                      </button>

                      {tuition.approvalStatus !== "approved" && (
                        <button
                          type="button"
                          onClick={() =>
                            requestApproval(
                              tuition.id,
                              "approved"
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={15} />
                          Approve
                        </button>
                      )}

                      {tuition.approvalStatus !== "rejected" && (
                        <button
                          type="button"
                          onClick={() =>
                            requestApproval(
                              tuition.id,
                              "rejected"
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          <XCircle size={15} />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">
                    {tuition.description}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Tuition details modal */}
      {selectedTuition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
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
                onClick={() => setSelectedTuitionId(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["Tuition ID", selectedTuition.id],
                ["Title", selectedTuition.title],
                ["Tutor Name", selectedTuition.tutorName],
                ["Tutor Email", selectedTuition.tutorEmail],
                ["Subject", selectedTuition.subject],
                ["Class Level", selectedTuition.classLevel],
                ["Mode", selectedTuition.mode],
                ["Location", selectedTuition.location],
                [
                  "Monthly Fee",
                  formatMoney(selectedTuition.monthlyFee),
                ],
                [
                  "Days Per Week",
                  String(selectedTuition.daysPerWeek),
                ],
                [
                  "Approval Status",
                  capitalize(
                    selectedTuition.approvalStatus
                  ),
                ],
                [
                  "Active Status",
                  selectedTuition.isActive
                    ? "Active"
                    : "Inactive",
                ],
                [
                  "Submitted",
                  formatDate(selectedTuition.createdAt),
                ],
                ["Description", selectedTuition.description],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-slate-100 pb-3"
                >
                  <p className="text-xs font-bold text-slate-400">
                    {label}
                  </p>

                  <p className="mt-1 break-words text-sm font-medium leading-6 text-[#14243a]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedTuitionId(null)}
              className="mt-6 w-full rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Approval confirmation modal */}
      {confirmation && confirmationTuition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="approval-confirm-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#e97c53]">
              <ShieldCheck size={24} />
            </div>

            <h2
              id="approval-confirm-title"
              className="text-xl font-extrabold text-[#14243a]"
            >
              {confirmation.nextStatus === "approved"
                ? "Approve Tuition?"
                : "Reject Tuition?"}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Are you sure you want to{" "}
              <strong>{confirmation.nextStatus}</strong>
              {" "}this tuition?
            </p>

            <p className="mt-2 text-sm font-semibold text-[#14243a]">
              {confirmationTuition.title}
            </p>

            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              Demo only. No actual tuition record or
              public listing will be updated.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmApproval}
                className={`rounded-xl px-4 py-3 text-sm font-bold text-white ${
                  confirmation.nextStatus === "approved"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm{" "}
                {confirmation.nextStatus === "approved"
                  ? "Approve"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
