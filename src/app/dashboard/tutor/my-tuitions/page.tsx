
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

type Approval = "approved" | "pending" | "rejected";
type Filter = "all" | Approval;

type Tuition = {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  location: string;
  salary: number;
  requirements?: string;
  tutorId: string;
  status: Approval;
  createdAt: string;
  updatedAt?: string;
};

type EditForm = {
  title: string;
  subject: string;
  classLevel: string;
  location: string;
  salary: number;
  requirements: string;
};

type TuitionResponse = {
  success: boolean;
  total: number;
  tuitions: Tuition[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const AUTH_KEY = "mentorlagbe_auth";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-2 block text-sm font-bold text-[#14243a]";

function money(value: number) {
  return `BDT ${value.toLocaleString("en-BD")}`;
}

function getToken(): string {
  const saved = sessionStorage.getItem(AUTH_KEY);

  if (!saved) {
    throw new Error("Please sign in as a tutor.");
  }

  try {
    const session = JSON.parse(saved) as {
      token?: string;
    };

    if (
      typeof session.token !== "string" ||
      !session.token
    ) {
      throw new Error("Missing token");
    }

    return session.token;
  } catch {
    throw new Error(
      "Invalid login session. Please sign in again."
    );
  }
}

async function responseMessage(
  response: Response
): Promise<string> {
  try {
    const result = (await response.json()) as {
      message?: string;
    };

    return (
      result.message ||
      `Request failed (${response.status})`
    );
  } catch {
    return `Request failed (${response.status})`;
  }
}

function ApprovalBadge({
  status,
}: {
  status: Approval;
}) {
  const styles: Record<Approval, string> = {
    approved: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function validateEdit(data: EditForm): string | null {
  if (
    data.title.trim().length < 5 ||
    data.title.trim().length > 150
  ) {
    return "Title must contain 5 to 150 characters.";
  }

  if (
    data.subject.trim().length < 2 ||
    data.subject.trim().length > 100
  ) {
    return "Subject must contain 2 to 100 characters.";
  }

  if (
    !data.classLevel.trim() ||
    data.classLevel.trim().length > 100
  ) {
    return "Enter a valid class level.";
  }

  if (
    data.location.trim().length < 2 ||
    data.location.trim().length > 200
  ) {
    return "Enter a valid location.";
  }

  if (
    !Number.isFinite(data.salary) ||
    data.salary <= 0 ||
    data.salary > 1000000
  ) {
    return "Salary must be between 1 and 1000000.";
  }

  if (data.requirements.trim().length > 2000) {
    return "Requirements cannot exceed 2000 characters.";
  }

  return null;
}

export default function MyTuitionsPage() {
  const toast = useToast();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [editForm, setEditForm] = useState<EditForm | null>(
    null
  );

  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [deletingBusy, setDeletingBusy] = useState(false);

  const deleting = tuitions.find(
    (item) => item.id === deletingId
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadTuitions() {
      setLoading(true);
      setError("");

      try {
        const token = getToken();

        const response = await fetch(
          `${API_URL}/api/tuitions/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            await responseMessage(response)
          );
        }

        const result =
          (await response.json()) as TuitionResponse;

        if (
          !result.success ||
          !Array.isArray(result.tuitions)
        ) {
          throw new Error("Invalid tuition response.");
        }

        if (!controller.signal.aborted) {
          setTuitions(result.tuitions);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setTuitions([]);
          setError(
            err instanceof Error
              ? err.message
              : "Could not load tuition listings."
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

  const stats = useMemo(
    () => ({
      total: tuitions.length,
      approved: tuitions.filter(
        (item) => item.status === "approved"
      ).length,
      pending: tuitions.filter(
        (item) => item.status === "pending"
      ).length,
      rejected: tuitions.filter(
        (item) => item.status === "rejected"
      ).length,
    }),
    [tuitions]
  );

  const visibleTuitions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const searchable = [
        tuition.id,
        tuition.title,
        tuition.subject,
        tuition.classLevel,
        tuition.location,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(query);

      const matchesFilter =
        filter === "all" ||
        tuition.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tuitions, search, filter]);

  function refreshTuitions() {
    setRefreshKey((current) => current + 1);
  }

  function startEdit(tuition: Tuition) {
    setEditingId(tuition.id);

    setEditForm({
      title: tuition.title,
      subject: tuition.subject,
      classLevel: tuition.classLevel,
      location: tuition.location,
      salary: tuition.salary,
      requirements: tuition.requirements || "",
    });

    setEditError("");
  }

  function updateEdit<K extends keyof EditForm>(
    field: K,
    value: EditForm[K]
  ) {
    setEditForm((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : null
    );

    setEditError("");
  }

  function closeEdit() {
    if (saving) return;

    setEditingId(null);
    setEditForm(null);
    setEditError("");
  }

  async function saveEdit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingId || !editForm || saving) return;

    const validationError = validateEdit(editForm);

    if (validationError) {
      setEditError(validationError);

      toast.error({
        title: "Invalid Tuition",
        description: validationError,
      });

      return;
    }

    setSaving(true);
    setEditError("");

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/tuitions/${editingId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editForm.title.trim(),
            subject: editForm.subject.trim(),
            classLevel: editForm.classLevel.trim(),
            location: editForm.location.trim(),
            salary: editForm.salary,
            requirements: editForm.requirements.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          await responseMessage(response)
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        tuition?: Tuition;
      };

      if (!result.success || !result.tuition) {
        throw new Error("Invalid update response.");
      }

      setTuitions((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? result.tuition!
            : item
        )
      );

      setEditingId(null);
      setEditForm(null);

      toast.success({
        title: "Tuition Updated",
        description:
          "Changes were saved to MongoDB. The tuition is pending admin approval.",
      });

      refreshTuitions();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update tuition.";

      setEditError(message);

      toast.error({
        title: "Update Failed",
        description: message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteTuition() {
    if (!deletingId || deletingBusy) return;

    setDeletingBusy(true);

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/tuitions/${deletingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          await responseMessage(response)
        );
      }

      const result = (await response.json()) as {
        success: boolean;
      };

      if (!result.success) {
        throw new Error("Delete confirmation failed.");
      }

      setTuitions((previous) =>
        previous.filter(
          (item) => item.id !== deletingId
        )
      );

      setDeletingId(null);

      toast.success({
        title: "Tuition Deleted",
        description:
          "The tuition was deleted from MongoDB.",
      });

      refreshTuitions();
    } catch (err) {
      toast.error({
        title: "Delete Failed",
        description:
          err instanceof Error
            ? err.message
            : "Unable to delete tuition.",
      });
    } finally {
      setDeletingBusy(false);
    }
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
              Manage your tuition listings and approval
              status.
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

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <strong>MongoDB Management:</strong> Your
          tuition listings load from the database.
          Editing sends a listing back for admin
          approval. Deleting permanently removes it.
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Total Tuitions", stats.total],
            ["Approved", stats.approved],
            ["Pending", stats.pending],
            ["Rejected", stats.rejected],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold text-slate-500">
                {label}
              </p>

              <p className="mt-3 text-3xl font-extrabold text-[#14243a]">
                {loading
                  ? "..."
                  : error
                    ? "N/A"
                    : value}
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
              onClick={refreshTuitions}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RotateCcw size={15} />
              Refresh Data
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div>
              <label
                htmlFor="search"
                className="sr-only"
              >
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
              <label
                htmlFor="status"
                className="sr-only"
              >
                Approval status
              </label>

              <select
                id="status"
                className={fieldClass}
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as Filter
                  )
                }
              >
                <option value="all">
                  All Statuses
                </option>
                <option value="approved">
                  Approved
                </option>
                <option value="pending">
                  Pending
                </option>
                <option value="rejected">
                  Rejected
                </option>
              </select>
            </div>
          </div>

          {/* Tuition cards */}
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                Loading tuition listings...
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-red-50 p-10 text-center">
                <p className="font-semibold text-red-700">
                  Could not load tuition data.
                </p>

                <button
                  type="button"
                  onClick={refreshTuitions}
                  className="mt-4 rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : visibleTuitions.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-10 text-center">
                <BookOpen
                  size={36}
                  className="mx-auto text-slate-400"
                />

                <p className="mt-3 font-bold text-[#14243a]">
                  No tuition listings found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {tuitions.length === 0
                    ? "Create your first tuition post."
                    : "Try changing your search or filter."}
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
                      <div className="mb-3">
                        <ApprovalBadge
                          status={tuition.status}
                        />
                      </div>

                      <p className="break-all text-xs text-slate-400">
                        ID: {tuition.id}
                      </p>

                      <h3 className="mt-2 text-lg font-bold text-[#14243a]">
                        {tuition.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {tuition.subject} |{" "}
                        {tuition.classLevel}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {tuition.location}
                      </p>

                      <p className="mt-3 text-sm font-bold text-[#14243a]">
                        {money(tuition.salary)}
                        <span className="font-normal text-slate-500">
                          {" "}/ month
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(tuition)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled
                        title="Activation API is not connected yet"
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-500 opacity-60"
                      >
                        <CheckCircle2 size={14} />
                        Activate
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeletingId(tuition.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {tuition.requirements && (
                    <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">
                      {tuition.requirements}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Edit modal */}
      {editingId && editForm && (
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
                onClick={closeEdit}
                disabled={saving}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-xs text-orange-700">
              Changes will be saved to MongoDB and
              submitted for admin approval.
            </p>

            <form
              onSubmit={saveEdit}
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
                  value={editForm.title}
                  onChange={(event) =>
                    updateEdit(
                      "title",
                      event.target.value
                    )
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
                    value={editForm.subject}
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
                    value={editForm.classLevel}
                    onChange={(event) =>
                      updateEdit(
                        "classLevel",
                        event.target.value
                      )
                    }
                  />
                </div>
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
                  value={editForm.location}
                  onChange={(event) =>
                    updateEdit(
                      "location",
                      event.target.value
                    )
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="edit-salary"
                  className={labelClass}
                >
                  Monthly Salary (BDT)
                </label>

                <input
                  id="edit-salary"
                  type="number"
                  min={1}
                  max={1000000}
                  className={fieldClass}
                  value={editForm.salary}
                  onChange={(event) =>
                    updateEdit(
                      "salary",
                      Number(event.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="edit-requirements"
                  className={labelClass}
                >
                  Requirements
                </label>

                <textarea
                  id="edit-requirements"
                  rows={4}
                  className={fieldClass}
                  value={editForm.requirements}
                  onChange={(event) =>
                    updateEdit(
                      "requirements",
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
                  onClick={closeEdit}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white hover:bg-[#d96c45] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete Tuition?"
        description={
          deleting
            ? `Permanently delete "${deleting.title}"?`
            : "Confirm deletion."
        }
        confirmLabel={
          deletingBusy
            ? "Deleting..."
            : "Delete Tuition"
        }
        variant="danger"
        onCancel={() => {
          if (!deletingBusy) {
            setDeletingId(null);
          }
        }}
        onConfirm={() => {
          if (!deletingBusy) {
            void deleteTuition();
          }
        }}
      >
        <p className="text-sm text-red-700">
          This will permanently delete the tuition
          from MongoDB. This action cannot be undone.
        </p>
      </ConfirmDialog>
    </main>
  );
}
