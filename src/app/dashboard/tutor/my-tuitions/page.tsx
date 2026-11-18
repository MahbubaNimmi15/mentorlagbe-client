
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Approval = "Approved" | "Pending" | "Rejected";
type Mode = "Online" | "Offline";
type Filter = "All" | Approval;

type Tuition = {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: Mode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  approval: Approval;
  active: boolean;
};

const demoTuitions: Tuition[] = [
  {
    id: "TUI-101",
    title: "Mathematics Tutor for Class 9–10",
    subject: "Mathematics",
    classLevel: "Class 9 - 10",
    mode: "Offline",
    location: "Dhanmondi, Dhaka",
    monthlyFee: 5000,
    daysPerWeek: 3,
    description:
      "Interactive mathematics lessons with weekly practice, exam preparation and regular progress reviews.",
    approval: "Approved",
    active: true,
  },
  {
    id: "TUI-102",
    title: "English Grammar and Spoken English",
    subject: "English",
    classLevel: "Class 6 - 8",
    mode: "Online",
    location: "Anywhere in Bangladesh",
    monthlyFee: 3500,
    daysPerWeek: 4,
    description:
      "Improve grammar, vocabulary and spoken English through guided exercises and practical communication.",
    approval: "Pending",
    active: false,
  },
  {
    id: "TUI-103",
    title: "HSC Physics Exam Preparation",
    subject: "Physics",
    classLevel: "HSC",
    mode: "Offline",
    location: "Uttara, Dhaka",
    monthlyFee: 6000,
    daysPerWeek: 3,
    description:
      "Concept-focused HSC physics lessons covering numerical problem-solving, revision and exam practice.",
    approval: "Rejected",
    active: false,
  },
];

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

function money(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function ApprovalBadge({ status }: { status: Approval }) {
  const styles: Record<Approval, string> = {
    Approved: "bg-emerald-100 text-emerald-800",
    Pending: "bg-amber-100 text-amber-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>(
    demoTuitions.map((item) => ({ ...item }))
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const [editing, setEditing] = useState<Tuition | null>(null);
  const [deleting, setDeleting] = useState<Tuition | null>(null);

  const [message, setMessage] = useState("");
  const [editError, setEditError] = useState("");

  const stats = {
    total: tuitions.length,
    approved: tuitions.filter((t) => t.approval === "Approved")
      .length,
    pending: tuitions.filter((t) => t.approval === "Pending")
      .length,
    active: tuitions.filter((t) => t.active).length,
  };

  const visibleTuitions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tuitions.filter((tuition) => {
      const text = [
        tuition.title,
        tuition.subject,
        tuition.classLevel,
        tuition.location,
        tuition.id,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(query);

      const matchesFilter =
        filter === "All" || tuition.approval === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tuitions, search, filter]);

  function changeActive(id: string) {
    const target = tuitions.find((t) => t.id === id);

    if (!target) return;

    if (target.approval !== "Approved") {
      setMessage(
        "Only approved tuitions can be activated or deactivated."
      );
      return;
    }

    setTuitions((previous) =>
      previous.map((tuition) =>
        tuition.id === id
          ? { ...tuition, active: !tuition.active }
          : tuition
      )
    );

    setMessage(
      `Demo status changed to ${
        target.active ? "Inactive" : "Active"
      }. This change is not saved to MongoDB.`
    );
  }

  function startEdit(tuition: Tuition) {
    setEditing({ ...tuition });
    setEditError("");
    setMessage("");
  }

  function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) return;

    if (editing.title.trim().length < 8) {
      setEditError("Title must contain at least 8 characters.");
      return;
    }

    if (!editing.subject.trim()) {
      setEditError("Subject is required.");
      return;
    }

    if (!editing.classLevel.trim()) {
      setEditError("Class level is required.");
      return;
    }

    if (
      editing.mode === "Offline" &&
      !editing.location.trim()
    ) {
      setEditError("Location is required for offline tuition.");
      return;
    }

    if (
      !Number.isInteger(editing.monthlyFee) ||
      editing.monthlyFee <= 0
    ) {
      setEditError("Monthly fee must be a positive whole number.");
      return;
    }

    if (
      !Number.isInteger(editing.daysPerWeek) ||
      editing.daysPerWeek < 1 ||
      editing.daysPerWeek > 7
    ) {
      setEditError("Days per week must be between 1 and 7.");
      return;
    }

    if (editing.description.trim().length < 30) {
      setEditError(
        "Description must contain at least 30 characters."
      );
      return;
    }

    setTuitions((previous) =>
      previous.map((tuition) =>
        tuition.id === editing.id
          ? {
              ...editing,
              title: editing.title.trim(),
              subject: editing.subject.trim(),
              classLevel: editing.classLevel.trim(),
              location: editing.location.trim(),
              description: editing.description.trim(),
            }
          : tuition
      )
    );

    setEditing(null);
    setEditError("");
    setMessage(
      "Demo tuition updated. Changes are not saved to the database."
    );
  }

  function deleteTuition() {
    if (!deleting) return;

    setTuitions((previous) =>
      previous.filter((tuition) => tuition.id !== deleting.id)
    );

    setMessage(
      "Demo tuition removed from the current browser session."
    );
    setDeleting(null);
  }

  function resetDemo() {
    setTuitions(demoTuitions.map((tuition) => ({ ...tuition })));
    setSearch("");
    setFilter("All");
    setEditing(null);
    setDeleting(null);
    setEditError("");
    setMessage("Demo listings restored.");
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard/tutor"
              className="text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              ← Tutor Overview
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#e97c53]">
              Tutor Workspace
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#14243a]">
              My Tuitions
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage tuition listings, approval and availability.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/post-tuition"
            className="rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white hover:bg-[#d96c45]"
          >
            + Post New Tuition
          </Link>
        </header>

        {/* Demo warning */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
          <strong>Demo Mode:</strong> These are sample tuition
          listings. Changes work only while this page is open.
          Refreshing restores the original records. Nothing is
          saved to MongoDB.
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Total Tuitions", stats.total],
            ["Approved", stats.approved],
            ["Active", stats.active],
            ["Pending", stats.pending],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold text-slate-500">
                {label}
              </p>

              <p className="mt-3 text-3xl font-extrabold text-[#14243a]">
                {value}
              </p>
            </div>
          ))}
        </section>

        {/* Listings */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#14243a]">
                Tuition Listings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Showing {visibleTuitions.length} of {tuitions.length}
                {" "}records
              </p>
            </div>

            <button
              type="button"
              onClick={resetDemo}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Reset Demo
            </button>
          </div>

          {message && (
            <p
              role="status"
              className="mb-5 rounded-xl bg-[#e3f4e8] p-4 text-sm font-medium text-[#27664a]"
            >
              {message}
            </p>
          )}

          <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div>
              <label htmlFor="search" className="sr-only">
                Search tuition
              </label>

              <input
                id="search"
                className={fieldClass}
                placeholder="Search title, subject or location..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="status" className="sr-only">
                Approval status
              </label>

              <select
                id="status"
                className={fieldClass}
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as Filter)
                }
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {visibleTuitions.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <p className="text-3xl">📚</p>
                <p className="mt-3 font-bold text-[#14243a]">
                  No tuition listings found
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filter.
                </p>
              </div>
            ) : (
              visibleTuitions.map((tuition) => (
                <article
                  key={tuition.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-orange-200"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <ApprovalBadge status={tuition.approval} />

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            tuition.active
                              ? "bg-[#e3f4e8] text-[#28765b]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {tuition.active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        {tuition.id}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-[#14243a]">
                        {tuition.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {tuition.subject} · {tuition.classLevel}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {tuition.mode} · {tuition.location}
                      </p>

                      <p className="mt-3 text-sm font-bold text-[#14243a]">
                        {money(tuition.monthlyFee)}
                        <span className="font-normal text-slate-500">
                          {" "}/ month · {tuition.daysPerWeek} days/week
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(tuition)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={tuition.approval !== "Approved"}
                        onClick={() => changeActive(tuition.id)}
                        className="rounded-xl border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {tuition.active ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleting(tuition)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
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

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-tuition-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="edit-tuition-title"
                className="text-xl font-bold text-[#14243a]"
              >
                Edit Tuition
              </h2>

              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-orange-700">
              Demo editing only — no database update.
            </p>

            <form onSubmit={saveEdit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="edit-title" className="mb-2 block text-sm font-bold">
                  Title
                </label>
                <input
                  id="edit-title"
                  className={fieldClass}
                  value={editing.title}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      title: event.target.value,
                    })
                  }
                  required
                  minLength={8}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-subject" className="mb-2 block text-sm font-bold">
                    Subject
                  </label>
                  <input
                    id="edit-subject"
                    className={fieldClass}
                    value={editing.subject}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        subject: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-class" className="mb-2 block text-sm font-bold">
                    Class Level
                  </label>
                  <input
                    id="edit-class"
                    className={fieldClass}
                    value={editing.classLevel}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        classLevel: event.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-mode" className="mb-2 block text-sm font-bold">
                    Mode
                  </label>
                  <select
                    id="edit-mode"
                    className={fieldClass}
                    value={editing.mode}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        mode: event.target.value as Mode,
                      })
                    }
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-location" className="mb-2 block text-sm font-bold">
                    Location
                  </label>
                  <input
                    id="edit-location"
                    className={fieldClass}
                    value={editing.location}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        location: event.target.value,
                      })
                    }
                    required={editing.mode === "Offline"}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-fee" className="mb-2 block text-sm font-bold">
                    Monthly Fee (৳)
                  </label>
                  <input
                    id="edit-fee"
                    type="number"
                    min={1}
                    step={1}
                    className={fieldClass}
                    value={editing.monthlyFee}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        monthlyFee: Number(event.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="edit-days" className="mb-2 block text-sm font-bold">
                    Days Per Week
                  </label>
                  <select
                    id="edit-days"
                    className={fieldClass}
                    value={editing.daysPerWeek}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        daysPerWeek: Number(event.target.value),
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="edit-description" className="mb-2 block text-sm font-bold">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={4}
                  minLength={30}
                  required
                  className={fieldClass}
                  value={editing.description}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      description: event.target.value,
                    })
                  }
                />
              </div>

              {editError && (
                <p role="alert" className="text-sm font-semibold text-red-600">
                  {editError}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white"
                >
                  Save Demo Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
          >
            <h2 id="delete-title" className="text-xl font-bold text-[#14243a]">
              Delete Tuition?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to remove
              {" "}<strong>{deleting.title}</strong> from
              this demo session?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteTuition}
                className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                Delete Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
