
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast-provider";

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
    title: "Mathematics Tutor for Class 9-10",
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

const labelClass =
  "mb-2 block text-sm font-bold text-[#14243a]";

function money(value: number) {
  return `BDT ${value.toLocaleString("en-BD")}`;
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

function validateTuition(tuition: Tuition): string | null {
  if (tuition.title.trim().length < 8) {
    return "Title must contain at least 8 characters.";
  }

  if (!tuition.subject.trim()) {
    return "Subject is required.";
  }

  if (!tuition.classLevel.trim()) {
    return "Class level is required.";
  }

  if (
    tuition.mode === "Offline" &&
    !tuition.location.trim()
  ) {
    return "Location is required for offline tuition.";
  }

  if (
    !Number.isInteger(tuition.monthlyFee) ||
    tuition.monthlyFee <= 0
  ) {
    return "Monthly fee must be a positive whole number.";
  }

  if (
    !Number.isInteger(tuition.daysPerWeek) ||
    tuition.daysPerWeek < 1 ||
    tuition.daysPerWeek > 7
  ) {
    return "Days per week must be between 1 and 7.";
  }

  if (tuition.description.trim().length < 30) {
    return "Description must contain at least 30 characters.";
  }

  return null;
}

export default function MyTuitionsPage() {
  const toast = useToast();

  const [tuitions, setTuitions] = useState<Tuition[]>(() =>
    demoTuitions.map((item) => ({ ...item }))
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const [editing, setEditing] = useState<Tuition | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );
  const [editError, setEditError] = useState("");

  const deleting = tuitions.find(
    (item) => item.id === deletingId
  );

  const stats = useMemo(
    () => ({
      total: tuitions.length,
      approved: tuitions.filter(
        (item) => item.approval === "Approved"
      ).length,
      pending: tuitions.filter(
        (item) => item.approval === "Pending"
      ).length,
      active: tuitions.filter(
        (item) => item.active
      ).length,
    }),
    [tuitions]
  );

  const visibleTuitions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const text = [
        tuition.id,
        tuition.title,
        tuition.subject,
        tuition.classLevel,
        tuition.location,
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
    const target = tuitions.find(
      (tuition) => tuition.id === id
    );

    if (!target) {
      toast.error({
        title: "Tuition Not Found",
        description: "The demo tuition is unavailable.",
      });
      return;
    }

    if (target.approval !== "Approved") {
      toast.warning({
        title: "Approval Required",
        description:
          "Only approved tuitions can be activated or deactivated.",
      });
      return;
    }

    const nextActive = !target.active;

    setTuitions((previous) =>
      previous.map((tuition) =>
        tuition.id === id
          ? { ...tuition, active: nextActive }
          : tuition
      )
    );

    toast.success({
      title: nextActive
        ? "Demo Tuition Activated"
        : "Demo Tuition Deactivated",
      description:
        `"${target.title}" is now ${
          nextActive ? "Active" : "Inactive"
        } in this page only.`,
    });
  }

  function startEdit(tuition: Tuition) {
    setEditing({ ...tuition });
    setEditError("");
  }

  function updateEdit<K extends keyof Tuition>(
    field: K,
    value: Tuition[K]
  ) {
    setEditing((current) =>
      current ? { ...current, [field]: value } : null
    );
    setEditError("");
  }

  function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) return;

    const error = validateTuition(editing);

    if (error) {
      setEditError(error);

      toast.error({
        title: "Unable to Save Demo Tuition",
        description: error,
      });

      return;
    }

    const updated: Tuition = {
      ...editing,
      title: editing.title.trim(),
      subject: editing.subject.trim(),
      classLevel: editing.classLevel.trim(),
      location: editing.location.trim(),
      description: editing.description.trim(),
    };

    setTuitions((previous) =>
      previous.map((tuition) =>
        tuition.id === updated.id ? updated : tuition
      )
    );

    setEditing(null);
    setEditError("");

    toast.success({
      title: "Demo Tuition Updated",
      description:
        `"${updated.title}" was updated locally. Nothing was saved to MongoDB.`,
    });
  }

  function requestDelete(id: string) {
    const target = tuitions.find(
      (tuition) => tuition.id === id
    );

    if (!target) {
      toast.error({
        title: "Tuition Not Found",
        description: "The demo listing is unavailable.",
      });
      return;
    }

    setDeletingId(id);
  }

  function deleteTuition() {
    if (!deletingId) return;

    const target = tuitions.find(
      (tuition) => tuition.id === deletingId
    );

    if (!target) {
      setDeletingId(null);

      toast.error({
        title: "Unable to Delete",
        description: "The selected demo listing was not found.",
      });

      return;
    }

    setTuitions((previous) =>
      previous.filter((tuition) => tuition.id !== deletingId)
    );

    setDeletingId(null);

    toast.success({
      title: "Demo Tuition Removed",
      description:
        `"${target.title}" was removed from the current page only. No database record was deleted.`,
    });
  }

  function resetDemo() {
    setTuitions(
      demoTuitions.map((tuition) => ({ ...tuition }))
    );
    setSearch("");
    setFilter("All");
    setEditing(null);
    setDeletingId(null);
    setEditError("");

    toast.info({
      title: "Demo Listings Restored",
      description:
        "The original three sample tuition listings are available again.",
    });
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard/tutor"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              <ArrowLeft size={17} />
              Tutor Overview
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
            className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white hover:bg-[#d96c45]"
          >
            <Plus size={18} />
            Post New Tuition
          </Link>
        </header>

        {/* Demo notice */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
          <strong>Demo Mode:</strong> These are sample tuition
          listings. Changes work only while this page is open.
          Refreshing restores the original records. Nothing
          is saved to MongoDB.
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
                Showing {visibleTuitions.length} of{" "}
                {tuitions.length} records
              </p>
            </div>

            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={15} />
              Reset Demo
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div>
              <label htmlFor="search" className="sr-only">
                Search tuition
              </label>

              <input
                id="search"
                type="search"
                className={fieldClass}
                placeholder="Search title, subject or location..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
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

          {/* Tuition cards */}
          <div className="space-y-4">
            {visibleTuitions.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <BookOpen
                  size={36}
                  className="mx-auto text-slate-400"
                />

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
                        <ApprovalBadge
                          status={tuition.approval}
                        />

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            tuition.active
                              ? "bg-[#e3f4e8] text-[#28765b]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {tuition.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        {tuition.id}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-[#14243a]">
                        {tuition.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {tuition.subject} |{" "}
                        {tuition.classLevel}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {tuition.mode} | {tuition.location}
                      </p>

                      <p className="mt-3 text-sm font-bold text-[#14243a]">
                        {money(tuition.monthlyFee)}
                        <span className="font-normal text-slate-500">
                          {" "}/ month |{" "}
                          {tuition.daysPerWeek} days/week
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(tuition)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          tuition.approval !== "Approved"
                        }
                        onClick={() =>
                          changeActive(tuition.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <CheckCircle2 size={14} />
                        {tuition.active
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          requestDelete(tuition.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
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

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#14243a]/70 p-4">
          <section
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
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-xs text-orange-700">
              Demo editing only - no database update.
            </p>

            <form
              onSubmit={saveEdit}
              noValidate
              className="mt-5 space-y-4"
            >
              <div>
                <label
                  htmlFor="edit-title"
                  className={labelClass}
                >
                  Title
                </label>

                <input
                  id="edit-title"
                  className={fieldClass}
                  value={editing.title}
                  onChange={(event) =>
                    updateEdit("title", event.target.value)
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-subject"
                    className={labelClass}
                  >
                    Subject
                  </label>

                  <input
                    id="edit-subject"
                    className={fieldClass}
                    value={editing.subject}
                    onChange={(event) =>
                      updateEdit(
                        "subject",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-class"
                    className={labelClass}
                  >
                    Class Level
                  </label>

                  <input
                    id="edit-class"
                    className={fieldClass}
                    value={editing.classLevel}
                    onChange={(event) =>
                      updateEdit(
                        "classLevel",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-mode"
                    className={labelClass}
                  >
                    Mode
                  </label>

                  <select
                    id="edit-mode"
                    className={fieldClass}
                    value={editing.mode}
                    onChange={(event) =>
                      updateEdit(
                        "mode",
                        event.target.value as Mode
                      )
                    }
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-location"
                    className={labelClass}
                  >
                    Location
                  </label>

                  <input
                    id="edit-location"
                    className={fieldClass}
                    value={editing.location}
                    onChange={(event) =>
                      updateEdit(
                        "location",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-fee"
                    className={labelClass}
                  >
                    Monthly Fee (BDT)
                  </label>

                  <input
                    id="edit-fee"
                    type="number"
                    min={1}
                    step={1}
                    className={fieldClass}
                    value={editing.monthlyFee}
                    onChange={(event) =>
                      updateEdit(
                        "monthlyFee",
                        event.target.value === ""
                          ? 0
                          : Number(event.target.value)
                      )
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-days"
                    className={labelClass}
                  >
                    Days Per Week
                  </label>

                  <select
                    id="edit-days"
                    className={fieldClass}
                    value={editing.daysPerWeek}
                    onChange={(event) =>
                      updateEdit(
                        "daysPerWeek",
                        Number(event.target.value)
                      )
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
                <label
                  htmlFor="edit-description"
                  className={labelClass}
                >
                  Description
                </label>

                <textarea
                  id="edit-description"
                  rows={4}
                  className={fieldClass}
                  value={editing.description}
                  onChange={(event) =>
                    updateEdit(
                      "description",
                      event.target.value
                    )
                  }
                />
              </div>

              {editError && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600"
                >
                  {editError}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white hover:bg-[#d96c45]"
                >
                  Save Demo Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Reusable delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete Tuition?"
        description={
          deleting
            ? `Are you sure you want to remove "${deleting.title}" from this demo session?`
            : "Confirm deletion of the selected demo tuition."
        }
        confirmLabel="Delete Demo Tuition"
        variant="danger"
        onCancel={() => setDeletingId(null)}
        onConfirm={deleteTuition}
      >
        <p className="text-sm">
          This action removes only the sample listing
          from the current page. No MongoDB record
          will be deleted.
        </p>
      </ConfirmDialog>
    </main>
  );
}
