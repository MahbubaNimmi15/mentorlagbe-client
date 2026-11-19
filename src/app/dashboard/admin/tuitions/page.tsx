
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

type Tuition = {
  id: string;
  title: string;
  tutorName: string;
  tutorEmail: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  createdAt: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
};

type Confirmation = {
  id: string;
  nextStatus: "approved" | "rejected";
};

const initialTuitions: Tuition[] = [
  {
    id: "TUI-101",
    title: "Mathematics Tutor for Class 9-10",
    tutorName: "Ayesha Rahman",
    tutorEmail: "ayesha@example.com",
    subject: "Mathematics",
    classLevel: "Class 9 - 10",
    mode: "Offline",
    location: "Dhanmondi, Dhaka",
    monthlyFee: 5000,
    daysPerWeek: 3,
    description:
      "Mathematics tuition covering algebra, geometry and exam preparation.",
    createdAt: "2026-11-15",
    approvalStatus: "pending",
    isActive: true,
  },
  {
    id: "TUI-102",
    title: "English Grammar and Spoken English",
    tutorName: "Tanvir Hasan",
    tutorEmail: "tanvir@example.com",
    subject: "English",
    classLevel: "HSC",
    mode: "Online",
    location: "Bangladesh",
    monthlyFee: 3500,
    daysPerWeek: 2,
    description:
      "Interactive grammar lessons, speaking practice and writing improvement.",
    createdAt: "2026-11-14",
    approvalStatus: "approved",
    isActive: true,
  },
  {
    id: "TUI-103",
    title: "Physics Preparation for HSC",
    tutorName: "Nabil Ahmed",
    tutorEmail: "nabil@example.com",
    subject: "Physics",
    classLevel: "HSC",
    mode: "Offline",
    location: "Uttara, Dhaka",
    monthlyFee: 6000,
    daysPerWeek: 3,
    description:
      "Concept-based Physics learning with numerical problem-solving sessions.",
    createdAt: "2026-11-13",
    approvalStatus: "pending",
    isActive: true,
  },
  {
    id: "TUI-104",
    title: "ICT and Programming Fundamentals",
    tutorName: "Samira Islam",
    tutorEmail: "samira@example.com",
    subject: "ICT",
    classLevel: "University",
    mode: "Online",
    location: "Bangladesh",
    monthlyFee: 4500,
    daysPerWeek: 2,
    description:
      "Introduction to coding, computing fundamentals and practical projects.",
    createdAt: "2026-11-12",
    approvalStatus: "rejected",
    isActive: false,
  },
  {
    id: "TUI-105",
    title: "Biology and Chemistry for SSC",
    tutorName: "Farhan Kabir",
    tutorEmail: "farhan@example.com",
    subject: "Biology",
    classLevel: "SSC",
    mode: "Offline",
    location: "Mirpur, Dhaka",
    monthlyFee: 4000,
    daysPerWeek: 4,
    description:
      "Structured lessons for Biology and Chemistry with regular mock tests.",
    createdAt: "2026-11-11",
    approvalStatus: "pending",
    isActive: true,
  },
];

const statusColors: Record<ApprovalStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMoney(value: number) {
  return `BDT ${value.toLocaleString("en-BD")}`;
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString(
    "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  );
}

export default function AdminTuitionsPage() {
  const toast = useToast();

  const [tuitions, setTuitions] = useState<Tuition[]>(() =>
    initialTuitions.map((tuition) => ({ ...tuition }))
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );
  const [confirmation, setConfirmation] =
    useState<Confirmation | null>(null);

  const selectedTuition = tuitions.find(
    (tuition) => tuition.id === selectedId
  );

  const confirmationTuition = confirmation
    ? tuitions.find((tuition) => tuition.id === confirmation.id)
    : null;

  const stats = useMemo(
    () => ({
      total: tuitions.length,
      pending: tuitions.filter(
        (tuition) => tuition.approvalStatus === "pending"
      ).length,
      approved: tuitions.filter(
        (tuition) => tuition.approvalStatus === "approved"
      ).length,
      rejected: tuitions.filter(
        (tuition) => tuition.approvalStatus === "rejected"
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
        tuition.tutorName,
        tuition.tutorEmail,
        tuition.subject,
        tuition.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        tuition.approvalStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tuitions, search, statusFilter]);

  function requestApproval(
    id: string,
    nextStatus: "approved" | "rejected"
  ) {
    const tuition = tuitions.find((item) => item.id === id);

    if (!tuition) {
      toast.error({
        title: "Tuition Not Found",
        description: "The demo record is unavailable.",
      });
      return;
    }

    if (tuition.approvalStatus === nextStatus) {
      toast.warning({
        title: "Status Already Applied",
        description: `This tuition is already ${nextStatus}.`,
      });
      return;
    }

    setSelectedId(null);
    setConfirmation({ id, nextStatus });
  }

  function confirmApproval() {
    if (!confirmation) return;

    const tuition = tuitions.find(
      (item) => item.id === confirmation.id
    );

    if (!tuition) {
      setConfirmation(null);
      toast.error({
        title: "Unable to Update",
        description: "The selected tuition was not found.",
      });
      return;
    }

    const nextStatus = confirmation.nextStatus;

    setTuitions((current) =>
      current.map((item) =>
        item.id === confirmation.id
          ? { ...item, approvalStatus: nextStatus }
          : item
      )
    );

    setConfirmation(null);

    if (nextStatus === "approved") {
      toast.success({
        title: "Demo Tuition Approved",
        description:
          `"${tuition.title}" is approved in local preview only.`,
      });
    } else {
      toast.warning({
        title: "Demo Tuition Rejected",
        description:
          `"${tuition.title}" is rejected in local preview only.`,
      });
    }
  }

  function resetDemo() {
    setTuitions(
      initialTuitions.map((tuition) => ({ ...tuition }))
    );
    setSearch("");
    setStatusFilter("all");
    setSelectedId(null);
    setConfirmation(null);

    toast.info({
      title: "Demo Records Restored",
      description:
        "Original tuition approval statuses have been restored.",
    });
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-7">
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
              Review and moderate sample tuition listings.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
            <ShieldCheck size={18} />
            Demo Mode
          </div>
        </header>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Demo Data Only:</strong> Approval and
          rejection update temporary local state. No real
          listing is published, removed or changed.
        </div>

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
                {item.value}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
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

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div className="relative">
              <label htmlFor="tuition-search" className="sr-only">
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
                placeholder="Search tuition, tutor, subject..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#e97c53]"
              />
            </div>

            <div>
              <label htmlFor="tuition-status" className="sr-only">
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

          <div className="mt-6 space-y-4">
            {filteredTuitions.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <h3 className="font-bold text-[#14243a]">
                  No tuition submissions found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing the search or status filter.
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

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
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
                        {tuition.subject} | {tuition.classLevel}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Tutor:{" "}
                        <span className="font-semibold text-slate-700">
                          {tuition.tutorName}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {tuition.mode} | {tuition.location}
                      </p>

                      <p className="mt-3 text-sm font-bold text-[#14243a]">
                        {formatMoney(tuition.monthlyFee)}
                        <span className="font-normal text-slate-500">
                          {" "}/ month |{" "}
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
                          setSelectedId(tuition.id)
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
                    capitalize(selectedTuition.approvalStatus),
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
                onClick={() => setSelectedId(null)}
                className="mt-6 w-full rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
              >
                Close Details
              </button>
            </section>
          </div>
        )}

        <ConfirmDialog
          open={Boolean(confirmation && confirmationTuition)}
          title={
            confirmation?.nextStatus === "approved"
              ? "Approve Tuition?"
              : "Reject Tuition?"
          }
          description={
            confirmation?.nextStatus === "approved"
              ? "Approve this sample tuition? The change will apply only in this browser session."
              : "Reject this sample tuition? The change will apply only in this browser session."
          }
          confirmLabel={
            confirmation?.nextStatus === "approved"
              ? "Approve Tuition"
              : "Reject Tuition"
          }
          variant={
            confirmation?.nextStatus === "approved"
              ? "info"
              : "danger"
          }
          onConfirm={confirmApproval}
          onCancel={() => setConfirmation(null)}
        >
          <p className="font-bold">
            {confirmationTuition?.title}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            No real tuition record or public listing
            will be updated.
          </p>
        </ConfirmDialog>
      </div>
    </main>
  );
}
