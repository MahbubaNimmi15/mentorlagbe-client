
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ApplicationStatus = "pending" | "accepted" | "rejected";

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

const initialApplications: Application[] = [
  {
    id: "APP-101",
    studentName: "Nusrat Jahan",
    studentEmail: "nusrat@example.com",
    studentPhone: "01700000001",
    tuitionTitle: "Mathematics Tutor for Class 9–10",
    tuitionId: "TUI-101",
    subject: "Mathematics",
    monthlyFee: 5000,
    preferredSchedule: "Sunday, Tuesday, Thursday - 6:00 PM",
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
    tuitionTitle: "Mathematics Tutor for Class 9–10",
    tuitionId: "TUI-101",
    subject: "Mathematics",
    monthlyFee: 5000,
    preferredSchedule: "Monday, Wednesday - 5:00 PM",
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
    preferredSchedule: "Friday and Saturday - 7:00 PM",
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

function formatMoney(value: number): string {
  return `৳${value.toLocaleString("en-BD")}`;
}

function formatDate(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TutorApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>(
    () => initialApplications.map((item) => ({ ...item }))
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);

  const [confirmation, setConfirmation] = useState<{
    id: string;
    status: "accepted" | "rejected";
  } | null>(null);

  const [notice, setNotice] = useState("");

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
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const pendingConfirmation = confirmation
    ? applications.find((item) => item.id === confirmation.id)
    : null;

  function updateStatus() {
    if (!confirmation) return;

    const application = applications.find(
      (item) => item.id === confirmation.id
    );

    if (!application || application.status !== "pending") {
      setConfirmation(null);
      return;
    }

    setApplications((current) =>
      current.map((item) =>
        item.id === confirmation.id
          ? { ...item, status: confirmation.status }
          : item
      )
    );

    setNotice(
      `${application.studentName}'s application was ${confirmation.status} in Demo Mode.`
    );

    setSelected(null);
    setConfirmation(null);
  }

  function resetDemo() {
    setApplications(
      initialApplications.map((item) => ({ ...item }))
    );
    setSearch("");
    setStatusFilter("all");
    setSelected(null);
    setConfirmation(null);
    setNotice("Original demo applications restored.");
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Page heading */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard/tutor"
              className="text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              ← Back to Tutor Overview
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#e97c53]">
              Tutor Workspace
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#14243a]">
              Manage Applicants
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review student applications and manage enrollment requests.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/my-tuitions"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#14243a] hover:border-[#e97c53]"
          >
            My Tuitions
          </Link>
        </header>

        {/* Demo warning */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
          <strong>Demo Mode:</strong> These applications are sample
          records only. Accepting or rejecting changes the current
          browser session. Refreshing restores the original records.
          No database or student account is updated.
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Applicants", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Accepted", value: stats.accepted },
            { label: "Rejected", value: stats.rejected },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-500">
                {item.label}
              </p>

              <p className="mt-3 text-3xl font-extrabold text-[#14243a]">
                {item.value}
              </p>
            </article>
          ))}
        </section>

        {/* List */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#14243a]">
                Student Applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredApplications.length} of{" "}
                {applications.length} applications
              </p>
            </div>

            <button
              type="button"
              onClick={resetDemo}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
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

          {/* Search and filter */}
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_200px]">
            <div>
              <label htmlFor="app-search" className="sr-only">
                Search applications
              </label>

              <input
                id="app-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, email, tuition..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#e97c53]"
              />
            </div>

            <div>
              <label htmlFor="app-filter" className="sr-only">
                Filter application status
              </label>

              <select
                id="app-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#e97c53]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Application cards */}
          <div className="mt-6 space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <p className="text-3xl">📋</p>
                <h3 className="mt-3 font-bold text-[#14243a]">
                  No applications found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try another search or status filter.
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-2xl border border-slate-200 p-5 hover:border-orange-200"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            statusStyles[application.status]
                          }`}
                        >
                          {application.status}
                        </span>

                        <span className="text-xs text-slate-400">
                          {application.id}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-[#14243a]">
                        {application.studentName}
                      </h3>

                      <p className="mt-1 break-all text-sm text-slate-600">
                        {application.studentEmail}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-[#14243a]">
                        {application.tuitionTitle}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {application.subject} ·{" "}
                        {formatMoney(application.monthlyFee)}/month
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Applied {formatDate(application.appliedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(application)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        View Details
                      </button>

                      {application.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmation({
                                id: application.id,
                                status: "accepted",
                              })
                            }
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setConfirmation({
                                id: application.id,
                                status: "rejected",
                              })
                            }
                            className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Student details */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-details-heading"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="student-details-heading"
                className="text-xl font-bold text-[#14243a]"
              >
                Student Details
              </h2>

              <button
                type="button"
                aria-label="Close student details"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              {[
                ["Name", selected.studentName],
                ["Email", selected.studentEmail],
                ["Phone", selected.studentPhone],
                ["Tuition", selected.tuitionTitle],
                ["Subject", selected.subject],
                ["Monthly Fee", formatMoney(selected.monthlyFee)],
                ["Preferred Schedule", selected.preferredSchedule],
                ["Applied Date", formatDate(selected.appliedAt)],
                ["Status", selected.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-slate-100 pb-3"
                >
                  <p className="text-xs font-semibold text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 break-words font-medium text-[#14243a]">
                    {value}
                  </p>
                </div>
              ))}

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Student Note
                </p>
                <p className="mt-2 leading-6 text-slate-700">
                  {selected.studentNote}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Accept / reject confirmation */}
      {confirmation && pendingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-heading"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
          >
            <h2
              id="confirmation-heading"
              className="text-xl font-bold text-[#14243a]"
            >
              {confirmation.status === "accepted"
                ? "Accept Application?"
                : "Reject Application?"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to{" "}
              {confirmation.status === "accepted"
                ? "accept"
                : "reject"}{" "}
              <strong>{pendingConfirmation.studentName}</strong>
              {"'s"} application?
            </p>

            <p className="mt-3 rounded-xl bg-orange-50 p-3 text-xs text-orange-800">
              This action affects demo data only.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateStatus}
                className={`rounded-xl px-4 py-3 text-sm font-bold text-white ${
                  confirmation.status === "accepted"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm{" "}
                {confirmation.status === "accepted"
                  ? "Accept"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}