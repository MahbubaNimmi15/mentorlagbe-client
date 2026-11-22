
"use client";
import Link from "next/link";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

type Tuition = {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  location: string;
  salary: number;
  requirements?: string;
  tutorId: string;
  status: "approved" | "pending" | "rejected";
  isActive?: boolean;
  createdAt: string;
};

type TuitionResponse = {
  success: boolean;
  total?: number;
  tuitions?: Tuition[];
  message?: string;
};

type LearningMode = "Online" | "Offline" | "Unknown";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const PAGE_SIZE = 6;

function getLearningMode(tuition: Tuition): LearningMode {
  const requirements = tuition.requirements || "";

  const match = requirements.match(
    /Tuition Mode:\s*(Online|Offline)/i
  );

  if (match) {
    return match[1].toLowerCase() === "online"
      ? "Online"
      : "Offline";
  }

  return "Unknown";
}

function getDaysPerWeek(tuition: Tuition): string {
  const match = (tuition.requirements || "").match(
    /Days Per Week:\s*([1-7])/i
  );

  return match ? match[1] : "Not specified";
}

function formatSalary(value: number) {
  return `BDT ${Number(value).toLocaleString("en-BD")}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function cleanDescription(value: string) {
  return value
    .replace(/Tuition Mode:\s*(Online|Offline)\s*/gi, "")
    .replace(/Days Per Week:\s*[1-7]\s*/gi, "")
    .trim();
}

const inputClass =
  "h-12 w-full rounded-xl border border-[#dce4e1] bg-white px-4 text-sm text-[#14243a] outline-none focus:border-[#e97c53] focus:ring-2 focus:ring-orange-100";

export default function BrowseTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [classLevel, setClassLevel] = useState("All");
  const [mode, setMode] = useState("All");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const requestedSubject = params.get("subject");

    if (requestedSubject) {
      setSubject(requestedSubject);
      setPage(1);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTuitions() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/tuitions`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Tuition API failed (${response.status})`
          );
        }

        const data =
          (await response.json()) as TuitionResponse;

        if (
          !data.success ||
          !Array.isArray(data.tuitions)
        ) {
          throw new Error(
            data.message || "Invalid tuition response."
          );
        }

        // Defense in depth:
        // Never show pending, rejected or inactive records.
        const publicRecords = data.tuitions.filter(
          (tuition) =>
            tuition.status === "approved" &&
            tuition.isActive !== false
        );

        if (!controller.signal.aborted) {
          setTuitions(publicRecords);
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

  const subjects = useMemo(() => {
    return Array.from(
      new Set(tuitions.map((t) => t.subject))
    ).sort();
  }, [tuitions]);

  const classLevels = useMemo(() => {
    return Array.from(
      new Set(tuitions.map((t) => t.classLevel))
    ).sort();
  }, [tuitions]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const searchable = [
        tuition.title,
        tuition.subject,
        tuition.classLevel,
        tuition.location,
        tuition.requirements || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(query);

      const matchesSubject =
        subject === "All" ||
        tuition.subject.toLowerCase() ===
          subject.toLowerCase();

      const matchesClass =
        classLevel === "All" ||
        tuition.classLevel === classLevel;

      const tuitionMode = getLearningMode(tuition);

      const matchesMode =
        mode === "All" || tuitionMode === mode;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesClass &&
        matchesMode
      );
    });
  }, [tuitions, search, subject, classLevel, mode]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const selectedTuition = tuitions.find(
    (tuition) => tuition.id === selectedId
  );

  function resetFilters() {
    setSearch("");
    setSubject("All");
    setClassLevel("All");
    setMode("All");
    setPage(1);
  }

  function refreshData() {
    setRefreshKey((value) => value + 1);
  }

  return (
    <>
      {/* HERO */}

      <section className="bg-[#fff9f0] py-16 md:py-20">
        <div className="site-container">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[3px] text-[#d97750]">
            Mentor marketplace
          </p>

          <h1 className="max-w-3xl text-5xl font-extrabold tracking-[-3px] md:text-6xl">
            Find a mentor who
            <span className="text-[#e97c53]">
              {" "}gets you.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-[#6c7b88]">
            Browse approved and active tuition listings.
            Explore subjects, learning modes, locations
            and monthly budgets.
          </p>
        </div>
      </section>

      {/* FILTERS */}

      <section className="site-container py-12">
        <div className="rounded-[24px] border border-[#e8ece9] bg-white p-5 shadow-[0_12px_35px_rgba(20,36,58,.04)] md:p-7">
          <div className="mb-6 flex items-center gap-2">
            <SlidersHorizontal size={19} />

            <h2 className="font-extrabold">
              Search & filter
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#526275]">
                Search & location
              </span>

              <div className="flex items-center gap-2 rounded-xl border border-[#dce4e1] px-4 focus-within:border-[#e97c53]">
                <Search
                  size={18}
                  className="shrink-0 text-[#82909b]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Title, subject, location..."
                  className="h-12 w-full min-w-0 bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#526275]">
                Subject
              </span>

              <select
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="All">
                  All subjects
                </option>

                {subject !== "All" &&
                  !subjects.some(
                    (item) =>
                      item.toLowerCase() ===
                      subject.toLowerCase()
                  ) && (
                    <option value={subject}>
                      {subject}
                    </option>
                  )}

                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#526275]">
                Class level
              </span>

              <select
                value={classLevel}
                onChange={(event) => {
                  setClassLevel(event.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="All">
                  All levels
                </option>

                {classLevels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#526275]">
                Learning mode
              </span>

              <select
                value={mode}
                onChange={(event) => {
                  setMode(event.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="All">
                  All modes
                </option>
                <option value="Online">
                  Online
                </option>
                <option value="Offline">
                  Offline
                </option>
                <option value="Unknown">
                  Not specified
                </option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-[#fff3eb] px-4 py-3 text-xs font-extrabold text-[#a9583b] hover:bg-[#ffe8d9]"
            >
              <RotateCcw size={15} />
              Reset filters
            </button>

            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e1] px-4 py-3 text-xs font-bold text-[#526275] hover:bg-slate-50 disabled:opacity-50"
            >
              <RotateCcw size={15} />
              Refresh listings
            </button>
          </div>
        </div>

        {/* RESULT HEADER */}

        <div className="mb-7 mt-12 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Available tuitions
            </h2>

            <p className="mt-2 text-sm text-[#778592]">
              {loading
                ? "Loading real tuition listings..."
                : error
                  ? "Unable to load listings"
                  : `Showing ${visible.length} of ${filtered.length} results`}
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-[#376a54]">
            <CheckCircle2 size={15} />
            Approved & Active
          </span>
        </div>

        {/* API ERROR */}

        {error && (
          <div
            role="alert"
            className="mb-7 rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <p className="font-bold text-red-700">
              Could not load tuition listings
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={refreshData}
              className="mt-4 rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* TUITION CARDS */}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-[24px] bg-slate-100"
              />
            ))}
          </div>
        ) : !error && visible.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((tuition) => {
              const tuitionMode = getLearningMode(tuition);

              return (
                <article
                  key={tuition.id}
                  className="flex h-full flex-col rounded-[24px] border border-[#e8ece9] bg-white p-6 shadow-[0_12px_35px_rgba(20,36,58,.04)] transition hover:border-orange-200 hover:shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-[#fff0e7] px-3 py-1 text-xs font-bold text-[#b65d3d]">
                      {tuition.subject}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Active
                    </span>
                  </div>

                  <h3 className="mt-5 line-clamp-2 text-xl font-extrabold leading-7 text-[#14243a]">
                    {tuition.title}
                  </h3>

                  <div className="mt-5 space-y-3 text-sm text-[#647487]">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>
                        {tuition.classLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{tuition.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>
                        {tuitionMode === "Unknown"
                          ? "Mode not specified"
                          : tuitionMode}
                        {" | "}
                        {getDaysPerWeek(tuition) ===
                        "Not specified"
                          ? "Schedule not specified"
                          : `${getDaysPerWeek(tuition)} days/week`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="border-t border-slate-100 pt-5">
                      <p className="text-xs font-semibold text-[#82909b]">
                        Monthly tuition fee
                      </p>

                      <p className="mt-1 text-xl font-extrabold text-[#14243a]">
                        {formatSalary(tuition.salary)}
                      </p>
                    </div>

                    <Link
  href={`/tuitions/${tuition.id}`}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d96c45]"
>
  View Details
  <ArrowRight size={17} />
</Link>

<button
  type="button"
  onClick={() => setSelectedId(tuition.id)}
  className="mt-3 w-full rounded-xl border border-[#dce4e1] px-5 py-3 text-sm font-bold text-[#526275] hover:bg-[#f7faf7]"
>
  Quick Preview
</button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : !error ? (
          <div className="rounded-[25px] border border-dashed border-[#d4ded9] bg-[#f8faf9] px-6 py-20 text-center">
            <Search
              size={37}
              className="mx-auto text-[#829b92]"
            />

            <h3 className="mt-5 text-xl font-extrabold">
              No matching tuitions
            </h3>

            <p className="mt-3 text-sm text-[#758390]">
              {tuitions.length === 0
                ? "No approved and active tuition listings are currently available."
                : "Try a different subject, location or keyword."}
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="btn-primary mt-6"
            >
              Clear all filters
            </button>
          </div>
        ) : null}

        {/* PAGINATION */}

        {!loading && !error && filtered.length > PAGE_SIZE && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                setPage(Math.max(1, currentPage - 1))
              }
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e1] px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <span className="px-3 text-sm font-bold text-[#526275]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage(
                  Math.min(totalPages, currentPage + 1)
                )
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e1] px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <p className="mt-12 text-center text-xs text-[#81909a]">
          Listings are approved by the platform.
          Contact and application functionality
          will be connected in a future step.
        </p>
      </section>

      {/* DETAILS MODAL */}

      {selectedTuition && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#14243a]/70 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="tuition-details-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="tuition-details-title"
                className="text-xl font-extrabold text-[#14243a]"
              >
                Tuition Details
              </h2>

              <button
                type="button"
                aria-label="Close tuition details"
                onClick={() => setSelectedId(null)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-xs font-bold text-slate-400">
                  Title
                </p>
                <h3 className="mt-2 text-lg font-bold text-[#14243a]">
                  {selectedTuition.title}
                </h3>
              </div>

              {[
                ["Subject", selectedTuition.subject],
                ["Class Level", selectedTuition.classLevel],
                ["Location", selectedTuition.location],
                ["Learning Mode",
                  getLearningMode(selectedTuition) === "Unknown"
                    ? "Not specified"
                    : getLearningMode(selectedTuition)],
                ["Days Per Week",
                  getDaysPerWeek(selectedTuition)],
                ["Monthly Fee",
                  formatSalary(selectedTuition.salary)],
                ["Submitted",
                  formatDate(selectedTuition.createdAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-slate-100 pb-3"
                >
                  <p className="text-xs font-bold text-slate-400">
                    {label}
                  </p>

                  <p className="mt-1 break-words font-semibold text-[#14243a]">
                    {value}
                  </p>
                </div>
              ))}

              <div>
                <p className="text-xs font-bold text-slate-400">
                  Requirements / Description
                </p>

                <p className="mt-2 whitespace-pre-wrap leading-7 text-[#526275]">
                  {cleanDescription(
                    selectedTuition.requirements || ""
                  ) || "No additional description provided."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="mt-7 w-full rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
            >
              Close Details
            </button>
          </section>
        </div>
      )}
    </>
  );
}
