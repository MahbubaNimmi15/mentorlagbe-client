
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  PlusCircle,
  Users,
} from "lucide-react";

type Tuition = {
  id: string;
  title: string;
  subject: string;
  classLevel: string;



  location: string;
  salary: number;
  requirements?: string;
  status: string;
  tutorId: string;
  createdAt: string;
};

type TuitionResponse = {
  success: boolean;
  total: number;
  tuitions: Tuition[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const managementTools = [
  {
    title: "Post New Tuition",
    description:
      "Create a new tuition listing and submit it for admin approval.",
    href: "/dashboard/tutor/post-tuition",
    icon: PlusCircle,
    buttonText: "Create Tuition",
  },
  {
    title: "My Tuitions",
    description:
      "Manage your tuition listings and check their approval status.",
    href: "/dashboard/tutor/my-tuitions",
    icon: BookOpen,
    buttonText: "Manage Tuitions",
  },
  {
    title: "Review Applicants",
    description:
      "Review student applications and accept or reject applicants.",
    href: "/dashboard/tutor/applicants",
    icon: ClipboardList,
    buttonText: "Coming Next",
    comingSoon: true,
  },
];

export default function TutorDashboardPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTuitions() {
      setLoading(true);
      setError("");

      try {
        const saved = sessionStorage.getItem(
          "mentorlagbe_auth"
        );

        if (!saved) {
          throw new Error(
            "Please sign in as a tutor."
          );
        }

        const session = JSON.parse(saved) as {
          token?: string;
        };

        if (!session.token) {
          throw new Error(
            "Please sign in as a tutor."
          );
        }

        const response = await fetch(
          `${API_URL}/api/tuitions/my`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Only tutor accounts can view these tuition listings."
          );
        }

        if (!response.ok) {
          throw new Error(
            "Unable to load tuition data. Please try again."
          );
        }

        const data =
          (await response.json()) as TuitionResponse;

        if (
          !data.success ||
          !Array.isArray(data.tuitions)
        ) {
          throw new Error(
            "Invalid tuition response."
          );
        }

        if (!controller.signal.aborted) {
          setTuitions(data.tuitions);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load tuition data."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTuitions();

    return () => {
      controller.abort();
    };
  }, []);

  const totalTuitions = tuitions.length;

  const approvedTuitions = tuitions.filter(
    (tuition) => tuition.status === "approved"
  ).length;

  const pendingTuitions = tuitions.filter(
    (tuition) => tuition.status === "pending"
  ).length;

  function countValue(value: number) {
    if (loading) return "...";
    if (error) return "N/A";
    return String(value);
  }

  const stats = [
    {
      title: "Total Tuitions",
      value: countValue(totalTuitions),
      description: "Your tuition posts in MongoDB",
      icon: BookOpen,
    },
    {
      title: "Approved & Active",
      value: countValue(approvedTuitions),
      description: "Approved tuition listings",
      icon: CheckCircle2,
    },
    {
      title: "Pending Approval",
      value: countValue(pendingTuitions),
      description: "Waiting for admin approval",
      icon: ClipboardList,
    },
    {
      title: "Total Applicants",
      value: "N/A",
      description: "Application API not connected yet",
      icon: Users,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fff9f0]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            href="/"
            className="hover:text-[#e97c53]"
          >
            MentorLagbe
          </Link>

          <span>/</span>

          <Link
            href="/dashboard"
            className="hover:text-[#e97c53]"
          >
            Dashboard
          </Link>

          <span>/</span>

          <span className="font-semibold text-[#14243a]">
            Tutor
          </span>
        </div>

        {/* Heading */}
        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-[#e3f4e8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#28765b]">
              Tutor Overview
            </span>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Live Tuition Data
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e97c53]">
            Tutor Workspace
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#14243a] sm:text-4xl">
            Your teaching workspace.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Manage tuition opportunities and student
            applications from one organized workspace.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/tutor/post-tuition"
              className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d96c45]"
            >
              <PlusCircle size={18} />
              Post New Tuition
            </Link>

            <Link
              href="/dashboard/tutor/my-tuitions"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#14243a] transition hover:border-[#e97c53] hover:text-[#e97c53]"
            >
              <BookOpen size={18} />
              My Tuitions
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* API Error */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-600">
                    {stat.title}
                  </p>

                  <div className="rounded-xl bg-[#fff0e7] p-3 text-[#e97c53]">
                    <Icon size={19} />
                  </div>
                </div>

                <p className="text-3xl font-extrabold text-[#14243a]">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Current Listings */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#14243a]">
              My Tuition Listings
            </h2>

            <span className="rounded-full bg-[#e3f4e8] px-3 py-1.5 text-xs font-bold text-[#28765b]">
              Live Tuition Listings
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Loading your tuition listings...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-red-600">
              Tuition listings could not be loaded.
            </div>
          ) : tuitions.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-[#fafbfc] px-5 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f4e8] text-[#28765b]">
                <GraduationCap size={26} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#14243a]">
                No tuition listings yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first tuition post to start
                managing listings.
              </p>

              <Link
                href="/dashboard/tutor/post-tuition"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
              >
                Create Tuition
                <PlusCircle size={16} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {tuitions.map((tuition) => (
                <div
                  key={tuition.id}
                  className="rounded-2xl border border-slate-200 bg-[#fafbfc] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#14243a]">
                        {tuition.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        {tuition.subject}
                        {" | "}
                        {tuition.classLevel}
                        {" | "}
                        {tuition.location}
                      </p>

                      <p className="mt-3 text-sm font-bold text-[#e97c53]">
                        BDT{" "}
                        {tuition.salary.toLocaleString(
                          "en-BD"
                        )}
                        <span className="font-normal text-slate-500">
                          {" "}/ month
                        </span>
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                        tuition.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : tuition.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : tuition.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tuition.status}
                    </span>
                  </div>
                </div>
              ))}

              <Link
                href="/dashboard/tutor/my-tuitions"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#e97c53] hover:underline"
              >
                Manage Tuitions
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* Management Tools */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#14243a]">
              Tutor Management Tools
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Manage your tuition listings and explore
              other tutor features.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {managementTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <article
                  key={tool.title}
                  className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 inline-flex rounded-xl bg-[#fff0e7] p-3 text-[#e97c53]">
                    <Icon size={23} />
                  </div>

                  <h3 className="text-lg font-bold text-[#14243a]">
                    {tool.title}
                  </h3>

                  <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500">
                    {tool.description}
                  </p>

                  {tool.comingSoon ? (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400">
                      {tool.buttonText}
                    </span>
                  ) : (
                    <Link
                      href={tool.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#e97c53] hover:underline"
                    >
                      {tool.buttonText}
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Upgrade */}
        <section className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#14243a] p-7 text-white sm:p-8">
          <div>
            <h2 className="text-xl font-bold">
              Grow your tutoring opportunities
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Explore subscription options and discover
              more tools for managing tuition listings.
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white hover:bg-[#d96c45]"
          >
            Explore Pro Plans
            <ArrowRight size={16} />
          </Link>
        </section>

        {/* Integration Status */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
          <strong>Integration status:</strong> Tuition
          listings and counts load from MongoDB.
          Student applications and subscription
          features are not connected yet.
        </div>
      </div>
    </main>
  );
}
