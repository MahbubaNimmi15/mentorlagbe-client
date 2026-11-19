
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Eye,
  RotateCcw,
  Search,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast-provider";

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

type Application = {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  tuitionTitle: string;
  tuitionId: string;
  subject: string;
  monthlyFee: number;
  preferredSchedule: string;
  studentNote: string;
  appliedAt: string;
  status: ApplicationStatus;
};

type Confirmation = {
  id: string;
  status: "accepted" | "rejected";
};

const initialApplications: Application[] = [
  {
    id: "APP-101",
    studentName: "Nusrat Jahan",
    studentEmail: "nusrat@example.com",
    studentPhone: "01700000001",
    tuitionTitle: "Mathematics Tutor for Class 9-10",
    tuitionId: "TUI-101",
    subject: "Mathematics",
    monthlyFee: 5000,
    preferredSchedule:
      "Sunday, Tuesday, Thursday - 6:00 PM",
    studentNote:
      "I need help with algebra, geometry and SSC exam preparation.",
    appliedAt: "2026-11-15",
    status: "pending",
  },
  {
    id: "APP-102",
    studentName: "Rafi Ahmed",
    studentEmail: "rafi@example.com",
    studentPhone: "01800000002",
    tuitionTitle: "Mathematics Tutor for Class 9-10",
    tuitionId: "TUI-101",
    subject: "Mathematics",
    monthlyFee: 5000,
    preferredSchedule:
      "Monday, Wednesday - 5:00 PM",
    studentNote:
      "I want regular practice sessions to improve my mathematics skills.",
    appliedAt: "2026-11-14",
    status: "accepted",
  },
  {
    id: "APP-103",
    studentName: "Sadia Rahman",
    studentEmail: "sadia@example.com",
    studentPhone: "01900000003",
    tuitionTitle: "English Grammar and Spoken English",
    tuitionId: "TUI-102",
    subject: "English",
    monthlyFee: 3500,
    preferredSchedule:
      "Friday and Saturday - 7:00 PM",
    studentNote:
      "I would like structured English grammar and speaking lessons.",
    appliedAt: "2026-11-12",
    status: "rejected",
  },
];

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

function formatMoney(value: number) {
  return `BDT ${value.toLocaleString("en-BD")}`;
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TutorApplicantsPage() {
  const toast = useToast();

  const [applications, setApplications] = useState<
    Application[]
  >(() => initialApplications.map((item) => ({ ...item })));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );
  const [confirmation, setConfirmation] =
    useState<Confirmation | null>(null);

  const selected = applications.find(
    (item) => item.id === selectedId
  );

  const pendingConfirmation = confirmation
    ? applications.find(
        (item) => item.id === confirmation.id
      )
    : null;

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

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((item) => {
      const searchableText = [
        item.id,
        item.studentName,
        item.studentEmail,
        item.studentPhone,
        item.tuitionTitle,
        item.subject,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  function requestStatusChange(
    id: string,
    status: "accepted" | "rejected"
  ) {
    const application = applications.find(
      (item) => item.id === id
    );

    if (!application) {
      toast.error({
        title: "Application Not Found",
        description:
          "The selected demo application is unavailable.",
      });
      return;
    }

    if (application.status !== "pending") {
      toast.warning({
        title: "Status Already Decided",
        description:
          "Only pending applications can be accepted or rejected in this demo.",
      });
      return;
    }

    setSelectedId(null);
    setConfirmation({ id, status });
  }

  function updateStatus() {
    if (!confirmation) return;

    const application = applications.find(
      (item) => item.id === confirmation.id
    );

    if (!application || application.status !== "pending") {
      setConfirmation(null);

      toast.error({
        title: "Unable to Update Status",
        description:
          "The application is unavailable or no longer pending.",
      });

      return;
    }

    const nextStatus = confirmation.status;

    setApplications((current) =>
      current.map((item) =>
        item.id === confirmation.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setConfirmation(null);

    if (nextStatus === "accepted") {
      toast.success({
        title: "Demo Application Accepted",
        description:
          `${application.studentName}'s status changed to Accepted in local preview only.`,
      });
    } else {
      toast.warning({
        title: "Demo Application Rejected",
        description:
          `${application.studentName}'s status changed to Rejected in local preview only.`,
      });
    }
  }

  function resetDemo() {
    setApplications(
      initialApplications.map((item) => ({ ...item }))
    );
    setSearch("");
    setStatusFilter("all");
    setSelectedId(null);
    setConfirmation(null);

    toast.info({
      title: "Demo Applications Restored",
      description:
        "All sample applications have been reset to their original statuses.",
    });
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Heading */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard/tutor"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              <ArrowLeft size={17} />
              Tutor Dashboard
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#e97c53]">
              Tutor Workspace
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#14243a]">
              Manage Applicants
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review applications and manage demo statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#14243a] hover:bg-slate-50"
          >
            <RotateCcw size={17} />
            Reset Demo
          </button>
        </header>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Frontend Preview:</strong> Accept and
          Reject actions only update local demo state.
          No student will be contacted, and no database
          record will be changed.
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Applications",
              value: stats.total,
              icon: Users,
              color: "bg-slate-100 text-[#14243a]",
            },
            {
              label: "Pending Review",
              value: stats.pending,
              icon: ClipboardList,
              color: "bg-amber-100 text-amber-700",
            },
            {
              label: "Accepted",
              value: stats.accepted,
              icon: CheckCircle2,
              color: "bg-emerald-100 text-emerald-700",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              icon: XCircle,
              color: "bg-red-100 text-red-700",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">
                    {stat.label}
                  </p>

                  <span
                    className={`rounded-xl p-3 ${stat.color}`}
                  >
                    <Icon size={20} />
                  </span>
                </div>

                <p className="mt-5 text-3xl font-extrabold text-[#14243a]">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Search and filters */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div>
              <label
                htmlFor="applicant-search"
                className="mb-2 block text-xs font-bold text-slate-600"
              >
                Search Applicants
              </label>

              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="applicant-search"
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search name, email, subject, application ID..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#e97c53]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="applicant-filter"
                className="mb-2 block text-xs font-bold text-slate-600"
              >
                Filter Status
              </label>

              <select
                id="applicant-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#e97c53]"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Showing {filteredApplications.length} of{" "}
            {applications.length} applications
          </p>
        </section>

        {/* Applicant cards */}
        <section className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
              <Search
                size={36}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 text-lg font-bold text-[#14243a]">
                No Applicants Found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try a different search or status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-5 rounded-xl bg-[#14243a] px-5 py-2.5 text-sm font-bold text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <article
                key={application.id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e3f4e8] text-sm font-extrabold text-emerald-800">
                      {getInitials(
                        application.studentName
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg font-extrabold text-[#14243a]">
                        {application.studentName}
                      </h2>

                      <p className="mt-1 break-words text-sm text-slate-500">
                        {application.studentEmail}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {application.id} | Applied{" "}
                        {formatDate(application.appliedAt)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[application.status]}`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-[#14243a]">
                    {application.tuitionTitle}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                    <span>
                      Subject: {application.subject}
                    </span>
                    <span>
                      Fee: {formatMoney(application.monthlyFee)}
                    </span>
                    <span>
                      Tuition: {application.tuitionId}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedId(application.id)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-[#14243a] hover:bg-slate-50"
                  >
                    <Eye size={17} />
                    View Details
                  </button>

                  {application.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          requestStatusChange(
                            application.id,
                            "accepted"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={17} />
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          requestStatusChange(
                            application.id,
                            "rejected"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))
          )}
        </section>

        {/* Details popup */}
        {selected && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#14243a]/70 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="applicant-details-title"
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#e97c53]">
                    Application Details
                  </p>
                  <h2
                    id="applicant-details-title"
                    className="mt-2 text-2xl font-extrabold text-[#14243a]"
                  >
                    {selected.studentName}
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close details"
                  onClick={() => setSelectedId(null)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                {[
                  ["Application ID", selected.id],
                  ["Tuition", selected.tuitionTitle],
                  ["Subject", selected.subject],
                  ["Monthly Fee", formatMoney(selected.monthlyFee)],
                  ["Email", selected.studentEmail],
                  ["Phone", selected.studentPhone],
                  ["Schedule", selected.preferredSchedule],
                  ["Applied On", formatDate(selected.appliedAt)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border-b border-slate-100 pb-3"
                  >
                    <p className="text-xs font-semibold text-slate-500">
                      {label}
                    </p>
                    <p className="mt-1 break-words font-medium text-[#14243a]">
                      {value}
                    </p>
                  </div>
                ))}

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Student Note
                  </p>
                  <p className="mt-2 leading-7 text-slate-700">
                    {selected.studentNote}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="mt-7 w-full rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white hover:bg-[#294562]"
              >
                Close Details
              </button>
            </section>
          </div>
        )}

        {/* Confirmation dialog */}
        <ConfirmDialog
          open={Boolean(confirmation && pendingConfirmation)}
          title={
            confirmation?.status === "accepted"
              ? "Accept Application?"
              : "Reject Application?"
          }
          description={
            confirmation?.status === "accepted"
              ? `Accept ${pendingConfirmation?.studentName ?? "this student's"} application? This only changes the local demo status.`
              : `Reject ${pendingConfirmation?.studentName ?? "this student's"} application? This only changes the local demo status.`
          }
          confirmLabel={
            confirmation?.status === "accepted"
              ? "Accept Application"
              : "Reject Application"
          }
          variant={
            confirmation?.status === "accepted"
              ? "info"
              : "warning"
          }
          onCancel={() => setConfirmation(null)}
          onConfirm={updateStatus}
        >
          <p>
            <strong>Tuition:</strong>{" "}
            {pendingConfirmation?.tuitionTitle}
          </p>
          <p className="mt-2">
            <strong>Current status:</strong>{" "}
            {pendingConfirmation?.status ?? "Unknown"}
          </p>
        </ConfirmDialog>
      </div>
    </main>
  );
}
