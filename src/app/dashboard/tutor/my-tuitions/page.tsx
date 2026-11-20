
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

type Status = "approved" | "pending" | "rejected";
type Filter = "all" | Status;

type Tuition = {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  location: string;
  salary: number;
  requirements?: string;
  tutorId: string;
  status: Status;
  isActive?: boolean;
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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-2 block text-sm font-bold text-[#14243a]";

function getToken(): string {
  const saved = sessionStorage.getItem("mentorlagbe_auth");

  if (!saved) {
    throw new Error("Please sign in as a tutor.");
  }

  try {
    const session = JSON.parse(saved) as {
      token?: string;
    };

    if (typeof session.token !== "string" || !session.token) {
      throw new Error("Missing token");
    }

    return session.token;
  } catch {
    throw new Error(
      "Invalid login session. Please sign in again."
    );
  }
}

async function apiError(response: Response): Promise<string> {
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

function formatMoney(value: number) {
  return `BDT ${value.toLocaleString("en-BD")}`;
}

function validateEdit(data: EditForm): string | null {
  if (data.title.trim().length < 5 ||
      data.title.trim().length > 150) {
    return "Title must contain 5 to 150 characters.";
  }

  if (data.subject.trim().length < 2 ||
      data.subject.trim().length > 100) {
    return "Subject must contain 2 to 100 characters.";
  }

  if (!data.classLevel.trim() ||
      data.classLevel.trim().length > 100) {
    return "Enter a valid class level.";
  }

  if (data.location.trim().length < 2 ||
      data.location.trim().length > 200) {
    return "Enter a valid location.";
  }

  if (!Number.isFinite(data.salary) ||
      data.salary <= 0 ||
      data.salary > 1000000) {
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
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

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

  const [activatingId, setActivatingId] =
    useState<string | null>(null);

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
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(await apiError(response));
        }

        const result = (await response.json()) as {
          success: boolean;
          tuitions?: Tuition[];
        };

        if (!result.success || !Array.isArray(result.tuitions)) {
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
              : "Unable to load tuition listings."
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

  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  const stats = useMemo(() => ({
    total: tuitions.length,
    approved: tuitions.filter(
      (t) => t.status === "approved"
    ).length,
    pending: tuitions.filter(
      (t) => t.status === "pending"
    ).length,
    rejected: tuitions.filter(
      (t) => t.status === "rejected"
    ).length,
  }), [tuitions]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const matchesSearch = [
        tuition.id,
        tuition.title,
        tuition.subject,
        tuition.classLevel,
        tuition.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      return matchesSearch &&
        (filter === "all" || tuition.status === filter);
    });
  }, [tuitions, search, filter]);

  const deleting = tuitions.find(
    (t) => t.id === deletingId
  );

  // ACTIVATE AND DEACTIVATE

  async function toggleActivation(tuition: Tuition) {
    if (
      tuition.status !== "approved" ||
      activatingId !== null
    ) {
      return;
    }

    // Older approved records without isActive
    // are treated as active.
    const nextActive = tuition.isActive === false;

    setActivatingId(tuition.id);

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/tuitions/${tuition.id}/activation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: nextActive,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await apiError(response));
      }

      const result = (await response.json()) as {
        success: boolean;
        tuition?: Tuition;
      };

      if (!result.success || !result.tuition) {
        throw new Error("Invalid activation response.");
      }

      const updated = result.tuition;

      setTuitions((previous) =>
        previous.map((item) =>
          item.id === tuition.id ? updated : item
        )
      );

      toast.success({
        title: nextActive
          ? "Tuition Activated"
          : "Tuition Deactivated",
        description:
          "Activation status saved successfully in MongoDB.",
      });

      refresh();
    } catch (err) {
      toast.error({
        title: "Activation Failed",
        description:
          err instanceof Error
            ? err.message
            : "Unable to change activation status.",
      });
    } finally {
      setActivatingId(null);
    }
  }

  // EDIT TUITION

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

  function closeEdit() {
    if (saving) return;
    setEditingId(null);
    setEditForm(null);
    setEditError("");
  }

  function updateEdit<K extends keyof EditForm>(
    field: K,
    value: EditForm[K]
  ) {
    setEditForm((current) =>
      current
        ? { ...current, [field]: value }
        : null
    );
    setEditError("");
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingId || !editForm || saving) return;

    const validationError = validateEdit(editForm);

    if (validationError) {
      setEditError(validationError);
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        throw new Error(await apiError(response));
      }

      const result = (await response.json()) as {
        success: boolean;
        tuition?: Tuition;
      };

      if (!result.success || !result.tuition) {
        throw new Error("Invalid update response.");
      }

      const updated = result.tuition;

      setTuitions((previous) =>
        previous.map((item) =>
          item.id === editingId ? updated : item
        )
      );

      closeEdit();

      toast.success({
        title: "Tuition Updated",
        description:
          "Changes saved and submitted for admin approval.",
      });

      refresh();
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

  // DELETE TUITION

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
        throw new Error(await apiError(response));
      }

      const result = (await response.json()) as {
        success: boolean;
      };

      if (!result.success) {
        throw new Error("Delete failed.");
      }

      setTuitions((previous) =>
        previous.filter((t) => t.id !== deletingId)
      );

      setDeletingId(null);

      toast.success({
        title: "Tuition Deleted",
        description: "Tuition removed from MongoDB.",
      });

      refresh();
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
              Manage your tuition listings and approval status.
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
          <strong>MongoDB Management:</strong> Edit or delete
          your tuition listings. Approved tuitions can also
          be activated and deactivated. Editing sends
          a listing back for admin approval.
        </div>

        {error && (
          <div role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

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
                {loading ? "..." : error ? "N/A" : value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#14243a]">
                Tuition Listings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Showing {visible.length} of {tuitions.length} records
              </p>
            </div>

            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-50"
            >
              <RotateCcw size={15} />
              Refresh Data
            </button>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <input
              aria-label="Search tuition"
              type="search"
              className={fieldClass}
              placeholder="Search title, subject or location..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              aria-label="Filter status"
              className={fieldClass}
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as Filter)
              }
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

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
                  onClick={refresh}
                  className="mt-4 rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : visible.length === 0 ? (
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
              visible.map((tuition) => {
                const approved = tuition.status === "approved";
                const active = tuition.isActive !== false;
                const busy = activatingId === tuition.id;

                const badgeColor =
                  tuition.status === "approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : tuition.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800";

                return (
                  <article
                    key={tuition.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-orange-200"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${badgeColor}`}>
                            {tuition.status}
                          </span>

                          {approved && (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                active
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {active ? "Active" : "Inactive"}
                            </span>
                          )}
                        </div>

                        <p className="break-all text-xs text-slate-400">
                          ID: {tuition.id}
                        </p>

                        <h3 className="mt-2 text-lg font-bold text-[#14243a]">
                          {tuition.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-600">
                          {tuition.subject} | {tuition.classLevel}
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
                          disabled={!approved || activatingId !== null}
                          onClick={() =>
                            void toggleActivation(tuition)
                          }
                          title={
                            !approved
                              ? "Only approved tuition can be activated"
                              : active
                                ? "Deactivate tuition"
                                : "Activate tuition"
                          }
                          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50 ${
                            !approved
                              ? "border-slate-200 text-slate-400"
                              : active
                                ? "border-orange-200 text-orange-700 hover:bg-orange-50"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          <CheckCircle2 size={14} />
                          {busy
                            ? "Saving..."
                            : !approved
                              ? "Activate"
                              : active
                                ? "Deactivate"
                                : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(tuition.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>

                    {tuition.requirements && (
                      <p className="mt-4 whitespace-pre-wrap border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">
                        {tuition.requirements}
                      </p>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>

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
              Editing will submit this tuition for admin approval again.
            </p>

            <form onSubmit={saveEdit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="edit-title" className={labelClass}>
                  Title
                </label>
                <input
                  id="edit-title"
                  className={fieldClass}
                  value={editForm.title}
                  onChange={(event) =>
                    updateEdit("title", event.target.value)
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-subject" className={labelClass}>
                    Subject
                  </label>
                  <input
                    id="edit-subject"
                    className={fieldClass}
                    value={editForm.subject}
                    onChange={(event) =>
                      updateEdit("subject", event.target.value)
                    }
                  />
                </div>
                <div>
                  <label htmlFor="edit-class" className={labelClass}>
                    Class Level
                  </label>
                  <input
                    id="edit-class"
                    className={fieldClass}
                    value={editForm.classLevel}
                    onChange={(event) =>
                      updateEdit("classLevel", event.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-location" className={labelClass}>
                  Location
                </label>
                <input
                  id="edit-location"
                  className={fieldClass}
                  value={editForm.location}
                  onChange={(event) =>
                    updateEdit("location", event.target.value)
                  }
                />
              </div>

              <div>
                <label htmlFor="edit-salary" className={labelClass}>
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
                <label htmlFor="edit-requirements" className={labelClass}>
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
                <p role="alert"
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
                  className="rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete Tuition?"
        description={
          deleting
            ? `Permanently delete "${deleting.title}"?`
            : "Confirm deletion."
        }
        confirmLabel={
          deletingBusy ? "Deleting..." : "Delete Tuition"
        }
        variant="danger"
        onCancel={() => {
          if (!deletingBusy) setDeletingId(null);
        }}
        onConfirm={() => {
          if (!deletingBusy) void deleteTuition();
        }}
      >
        <p className="text-sm text-red-700">
          This permanently deletes the tuition from MongoDB.
          This action cannot be undone.
        </p>
      </ConfirmDialog>
    </main>
  );
}
