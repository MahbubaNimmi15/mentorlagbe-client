
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { TuitionCard } from "@/components/tuition-card";
import {
  subjects,
  tuitions,
} from "@/lib/tuition-data";

const PAGE_SIZE = 6;

const classLevels = [
  "Class 6–8",
  "Class 9–10",
  "HSC",
  "University",
  "IELTS",
];

export default function BrowseTuitionsPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [classLevel, setClassLevel] = useState("All");
  const [mode, setMode] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const requestedSubject = params.get("subject");

    if (
      requestedSubject &&
      subjects.includes(requestedSubject)
    ) {
      setSubject(requestedSubject);
    }
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const matchesSearch =
        tuition.title.toLowerCase().includes(query) ||
        tuition.subject.toLowerCase().includes(query);

      const matchesSubject =
        subject === "All" ||
        tuition.subject === subject;

      const matchesClass =
        classLevel === "All" ||
        tuition.classLevel === classLevel;

      const matchesMode =
        mode === "All" || tuition.mode === mode;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesClass &&
        matchesMode
      );
    });
  }, [search, subject, classLevel, mode]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function resetFilters() {
    setSearch("");
    setSubject("All");
    setClassLevel("All");
    setMode("All");
    setPage(1);
  }

  return (
    <>
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
            Browse tuition opportunities and find
            subjects, schedules and budgets that match
            your learning goals.
          </p>
        </div>
      </section>

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
                Search
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-[#dce4e1] px-4">
                <Search
                  size={18}
                  className="text-[#82909b]"
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Title or subject"
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
                className="h-12 w-full rounded-xl border border-[#dce4e1] bg-white px-4 text-sm outline-none"
              >
                <option value="All">All subjects</option>
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
                className="h-12 w-full rounded-xl border border-[#dce4e1] bg-white px-4 text-sm outline-none"
              >
                <option value="All">All levels</option>
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
                className="h-12 w-full rounded-xl border border-[#dce4e1] bg-white px-4 text-sm outline-none"
              >
                <option value="All">Online & Offline</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#fff3eb] px-4 py-3 text-xs font-extrabold text-[#a9583b] hover:bg-[#ffe8d9]"
          >
            <RotateCcw size={15} />
            Reset filters
          </button>
        </div>

        <div className="mb-7 mt-12 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Available tuition previews
            </h2>
            <p className="mt-2 text-sm text-[#778592]">
              Showing {visible.length} of {filtered.length} results
            </p>
          </div>

          <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-[#376a54]">
            Demo catalog
          </span>
        </div>

        {visible.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((tuition) => (
              <TuitionCard
                key={tuition.id}
                tuition={tuition}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[25px] border border-dashed border-[#d4ded9] bg-[#f8faf9] px-6 py-20 text-center">
            <Search
              size={37}
              className="mx-auto text-[#829b92]"
            />
            <h3 className="mt-5 text-xl font-extrabold">
              No matching tuitions
            </h3>
            <p className="mt-3 text-sm text-[#758390]">
              Try a different subject, class or keyword.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn-primary mt-6"
            >
              Clear all filters
            </button>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
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
          These are demonstration listings, not
          verified or bookable tuition offers.
        </p>
      </section>
    </>
  );
}
