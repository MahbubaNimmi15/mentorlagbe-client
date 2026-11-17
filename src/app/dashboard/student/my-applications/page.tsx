
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

type Application = {
  id: string;
  tuitionTitle: string;
  tutorName: string;
  tutorEmail: string;
  subject: string;
  monthlyFee: number;
  appliedAt: string;
  status: ApplicationStatus;
};

const demoApplications: Application[] = [
  {
    id: "demo-001",
    tuitionTitle: "Master Mathematics with Confidence",
    tutorName: "Nafisa Rahman",
    tutorEmail: "demo-tutor1@example.com",
    subject: "Mathematics",
    monthlyFee: 2500,
    appliedAt: "2026-11-12",
    status: "pending",
  },
  {
    id: "demo-002",
    tuitionTitle: "Physics Made Simple",
    tutorName: "Arif Hasan",
    tutorEmail: "demo-tutor2@example.com",
    subject: "Physics",
    monthlyFee: 3500,
    appliedAt: "2026-11-10",
    status: "accepted",
  },
  {
    id: "demo-003",
    tuitionTitle: "IELTS Speaking & Writing",
    tutorName: "Tahmid Karim",
    tutorEmail: "demo-tutor3@example.com",
    subject: "IELTS",
    monthlyFee: 5000,
    appliedAt: "2026-11-08",
    status: "rejected",
  },
];

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

function formatMoney(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>(demoApplications);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [cancelId, setCancelId] =
    useState<string | null>(null);

  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        application.tuitionTitle
          .toLowerCase()
          .includes(keyword) ||
        application.subject
          .toLowerCase()
          .includes(keyword) ||
        application.tutorName
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const pendingCount = applications.filter(
    (item) => item.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (item) => item.status === "accepted"
  ).length;

  function cancelApplication() {
    if (!cancelId) return;

    const selected = applications.find(
      (item) => item.id === cancelId
    );

    if (!selected || selected.status !== "pending") {
      setCancelId(null);
      return;
    }

    setApplications((previous) =>
      previous.filter((item) => item.id !== cancelId)
    );

    setNotice(
      "Demo application removed from this preview. No database record was changed."
    );

    setCancelId(null);
  }

  return (
    <div className="space-y-8">
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
              Track applications and their statuses from
              one organized workspace.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="btn-primary"
          >
            Find Tuitions
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="mt-5 rounded-xl border border-[#f2d4ba] bg-[#fff7e9] p-4 text-sm leading-6 text-[#986034]">
          Demo preview only. These applications are
          fictional, and changes are not saved to MongoDB.
          Refreshing the page restores the sample data.
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <SummaryCard
          label="Total Applied"
          value={applications.length}
          icon={<BookOpen size={22} />}
          background="bg-[#e7f0ff]"
        />

        <SummaryCard
          label="Accepted"
          value={acceptedCount}
          icon={<CheckCircle2 size={22} />}
          background="bg-[#e3f4e8]"
        />

        <SummaryCard
          label="Pending"
          value={pendingCount}
          icon={<Clock3 size={22} />}
          background="bg-[#fff0e7]"
        />
      </div>

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
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>

        {notice && (
          <div
            role="status"
            className="mt-5 rounded-xl bg-[#e3f4e8] p-4 text-sm text-[#326752]"
          >
            {notice}
          </div>
        )}

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead>
              <tr className="border-b border-[#e6ebe7] text-xs uppercase tracking-wide text-[#778592]">
                <th className="px-3 py-4">Tuition</th>
                <th className="px-3 py-4">Tutor</th>
                <th className="px-3 py-4">Fee</th>
                <th className="px-3 py-4">Applied</th>
                <th className="px-3 py-4">Status</th>
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
                      {application.tutorName}
                    </p>
                    <p className="mt-2 text-xs text-[#7d8a94]">
                      {application.tutorEmail}
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
                      {application.appliedAt}
                    </span>
                  </td>

                  <td className="px-3 py-5">
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-bold capitalize ${statusStyles[application.status]}`}
                    >
                      {application.status}
                    </span>
                  </td>

                  <td className="px-3 py-5 text-right">
                    {application.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setNotice("");
                          setCancelId(application.id);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Cancel
                      </button>
                    ) : (
                      <span className="text-xs text-[#9aa5ad]">
                        No action
                      </span>
                    )}
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
                No applications found
              </h3>
              <p className="mt-2 text-sm text-[#74828d]">
                Try another search or status filter.
              </p>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-[#83919b]">
          Showing {filtered.length} of{" "}
          {applications.length} demo applications
        </p>
      </section>

      {cancelId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-dialog-title"
            className="w-full max-w-md rounded-[24px] bg-white p-7 shadow-2xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <XCircle size={28} />
            </div>

            <h2
              id="cancel-dialog-title"
              className="mt-5 text-xl font-extrabold"
            >
              Remove demo application?
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#687683]">
              This removes the pending application from
              the current preview only. It will not affect
              a real student account.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelId(null)}
                className="rounded-xl border border-[#dce4e1] px-5 py-3 text-sm font-bold"
              >
                Keep
              </button>

              <button
                type="button"
                onClick={cancelApplication}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  background,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
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
