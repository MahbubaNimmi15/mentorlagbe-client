
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  MapPin,
  Monitor,
  ShieldCheck,
  UserRound,
  AlertCircle,
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
  status: string;
  isActive?: boolean;
  createdAt?: string;
};

type AuthSession = {
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

function formatBDT(value: number) {
  return `৳${Number(value).toLocaleString("en-BD")}`;
}

function getMode(requirements?: string) {
  const match = (requirements || "").match(
    /Tuition Mode:\s*(Online|Offline)/i
  );

  if (!match) return "Not specified";

  return match[1].toLowerCase() === "online"
    ? "Online"
    : "Offline";
}

function getDays(requirements?: string) {
  const match = (requirements || "").match(
    /Days Per Week:\s*([1-7])/i
  );

  return match ? match[1] : "Not specified";
}

function getDescription(requirements?: string) {
  return (requirements || "")
    .replace(/Tuition Mode:\s*(Online|Offline)/gi, "")
    .replace(/Days Per Week:\s*[1-7]/gi, "")
    .trim();
}

function getSession(): AuthSession | null {
  try {
    const saved = sessionStorage.getItem(
      "mentorlagbe_auth"
    );

    if (!saved) return null;

    return JSON.parse(saved) as AuthSession;
  } catch {
    return null;
  }
}

function InfoItem({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#f7faf7] p-4">
      <span className="text-[#527b67]">
        {icon}
      </span>

      <div>
        <p className="text-xs font-semibold text-[#7a8893]">
          {title}
        </p>

        <p className="mt-1 text-sm font-bold text-[#14243a]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function TuitionDetailsPage() {
  const params = useParams<{ id: string }>();
  const tuitionId = params.id;

  const [tuition, setTuition] =
    useState<Tuition | null>(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [session, setSession] =
    useState<AuthSession | null>(null);

  const [studentPhone, setStudentPhone] =
    useState("");

  const [preferredSchedule, setPreferredSchedule] =
    useState("");

  const [studentNote, setStudentNote] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [applyError, setApplyError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadyApplied, setAlreadyApplied] =
    useState(false);

  // Read current logged-in user.
  useEffect(() => {
    setSession(getSession());
  }, []);

  // Load real approved and active tuition.
  useEffect(() => {
    const controller = new AbortController();

    async function loadTuition() {
      setLoading(true);
      setPageError("");
      setTuition(null);

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
            `Tuition API error (${response.status})`
          );
        }

        const data = (await response.json()) as {
          success?: boolean;
          tuitions?: Tuition[];
        };

        if (
          !data.success ||
          !Array.isArray(data.tuitions)
        ) {
          throw new Error(
            "Invalid tuition API response."
          );
        }

        const found = data.tuitions.find(
          (item) =>
            item.id === tuitionId &&
            item.status === "approved" &&
            item.isActive !== false
        );

        if (!controller.signal.aborted) {
          if (found) {
            setTuition(found);
          } else {
            setPageError(
              "This tuition is not available. It may be inactive or awaiting approval."
            );
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setPageError(
            error instanceof Error
              ? error.message
              : "Failed to load tuition."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTuition();

    return () => controller.abort();
  }, [tuitionId, refreshKey]);

  const role = session?.user?.role;
  const isLoggedIn = Boolean(session?.token);
  const isStudent = role === "student";

  async function handleApply(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !tuition ||
      !session?.token ||
      !isStudent ||
      submitting ||
      submitted ||
      alreadyApplied
    ) {
      return;
    }

    setSubmitting(true);
    setApplyError("");

    try {
      const response = await fetch(
        `${API_URL}/api/tuitions/${tuition.id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            studentPhone: studentPhone.trim(),
            preferredSchedule:
              preferredSchedule.trim(),
            studentNote: studentNote.trim(),
          }),
        }
      );

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (response.status === 409) {
        setAlreadyApplied(true);
        setApplyError(
          result.message ||
            "You have already applied for this tuition."
        );
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to submit application."
        );
      }

      setSubmitted(true);
      setApplyError("");
    } catch (error) {
      setApplyError(
        error instanceof Error
          ? error.message
          : "Application failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Loading state.
  if (loading) {
    return (
      <main className="site-container min-h-[60vh] py-24 text-center">
        <Loader2
          size={36}
          className="mx-auto animate-spin text-[#e97c53]"
        />

        <p className="mt-5 font-semibold text-[#627181]">
          Loading tuition details...
        </p>
      </main>
    );
  }

  // Tuition not found.
  if (!tuition) {
    return (
      <main className="site-container min-h-[60vh] py-24 text-center">
        <AlertCircle
          size={42}
          className="mx-auto text-[#e97c53]"
        />

        <h1 className="mt-5 text-2xl font-extrabold">
          Tuition Not Available
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm text-[#627181]">
          {pageError}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              setRefreshKey((value) => value + 1)
            }
            className="rounded-xl border border-slate-200 px-5 py-3 font-bold"
          >
            Try Again
          </button>

          <Link
            href="/tuitions"
            className="btn-primary"
          >
            Browse Tuitions
          </Link>
        </div>
      </main>
    );
  }

  const mode = getMode(tuition.requirements);
  const days = getDays(tuition.requirements);
  const description = getDescription(
    tuition.requirements
  );

  return (
    <>
      {/* HERO */}

      <section className="bg-[#fff9f0] py-12 md:py-16">
        <div className="site-container">
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#526275] hover:text-[#d97750]"
          >
            <ArrowLeft size={17} />
            Back to all tuitions
          </Link>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-[#326752]">
              {tuition.subject}
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#526275]">
              {tuition.classLevel}
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#526275]">
              {mode}
            </span>

            <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
              Approved & Active
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-[-2px] text-[#14243a] md:text-6xl">
            {tuition.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#687683]">
            {description ||
              "Explore this tuition opportunity and apply for personalized learning."}
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="site-container grid gap-9 py-12 lg:grid-cols-[1fr_360px] lg:py-16">
        <div className="space-y-8">
          {/* BANNER */}

          <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-[30px] bg-[#e3f4e8] md:h-[360px]">
            <div className="absolute -left-12 -top-20 h-60 w-60 rounded-full border-[35px] border-white/40" />

            <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full border-[35px] border-white/40" />

            <BookOpen
              size={110}
              strokeWidth={1.2}
              className="relative text-[#348265]"
            />
          </div>

          {/* ABOUT */}

          <div className="rounded-[25px] border border-[#e7ebe8] p-7 md:p-9">
            <div className="flex items-center gap-3">
              <BookOpen
                size={23}
                className="text-[#d97750]"
              />

              <h2 className="text-2xl font-extrabold">
                About this tuition
              </h2>
            </div>

            <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-[#627181]">
              {description ||
                "No additional description provided."}
            </p>
          </div>

          {/* LEARNING DETAILS */}

          <div className="rounded-[25px] border border-[#e7ebe8] p-7 md:p-9">
            <h2 className="text-2xl font-extrabold">
              Learning details
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <InfoItem
                icon={<GraduationCap size={19} />}
                title="Class level"
                value={tuition.classLevel}
              />

              <InfoItem
                icon={<BookOpen size={19} />}
                title="Subject"
                value={tuition.subject}
              />

              <InfoItem
                icon={<CalendarDays size={19} />}
                title="Weekly sessions"
                value={
                  days === "Not specified"
                    ? days
                    : `${days} days per week`
                }
              />

              <InfoItem
                icon={
                  mode === "Online" ? (
                    <Monitor size={19} />
                  ) : (
                    <MapPin size={19} />
                  )
                }
                title="Learning mode"
                value={mode}
              />

              <InfoItem
                icon={<MapPin size={19} />}
                title="Location"
                value={tuition.location}
              />

              <InfoItem
                icon={<Clock3 size={19} />}
                title="Class schedule"
                value="To be confirmed"
              />
            </div>
          </div>

          {/* APPLICATION INFORMATION */}

          <div className="rounded-[25px] bg-[#e3f4e8] p-7 md:p-9">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} />

              <h2 className="text-xl font-extrabold">
                Application information
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#526c62]">
              Students can submit their contact number,
              preferred schedule and learning note.
              Applications are saved in MongoDB with
              Pending status for tutor review.
            </p>
          </div>
        </div>

        {/* SIDEBAR */}

        <aside className="h-fit rounded-[25px] border border-[#e7ebe8] bg-white p-7 shadow-[0_18px_45px_rgba(20,36,58,.06)] lg:sticky lg:top-28">
          <p className="text-sm text-[#718190]">
            Monthly tuition fee
          </p>

          <p className="mt-2 text-4xl font-extrabold tracking-tight text-[#14243a]">
            {formatBDT(tuition.salary)}
          </p>

          <p className="mt-2 text-xs text-[#718190]">
            Per month
          </p>

          <div className="mt-7 border-t border-[#edf0ed] pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e7] text-[#b86042]">
                <UserRound size={24} />
              </div>

              <div>
                <p className="text-xs text-[#718190]">
                  Tuition provider
                </p>

                <p className="font-bold">
                  Registered Tutor
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-[#627181]">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-[#348265]"
                />

                {days === "Not specified"
                  ? "Sessions not specified"
                  : `${days} sessions per week`}
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-[#348265]"
                />

                {mode === "Not specified"
                  ? "Mode not specified"
                  : `${mode} learning`}
              </div>
            </div>
          </div>

          {/* GUEST */}

          {!isLoggedIn && (
            <div className="mt-8">
              <p className="mb-4 text-sm leading-6 text-[#647487]">
                Sign in as a Student to apply.
              </p>

              <Link
                href="/sign-in"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14243a] px-5 py-4 text-sm font-bold text-white"
              >
                Sign In to Apply
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {/* TUTOR OR ADMIN */}

          {isLoggedIn && !isStudent && (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              <AlertCircle size={19} className="mb-2" />
              Only Student accounts can apply for tuition.
            </div>
          )}

          {/* STUDENT APPLY FORM */}

          {isLoggedIn && isStudent && (
            <div className="mt-8 border-t border-[#edf0ed] pt-7">
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Apply for Tuition
              </h2>

              {submitted ? (
                <div
                  role="status"
                  className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5"
                >
                  <CheckCircle2
                    size={30}
                    className="text-emerald-600"
                  />

                  <h3 className="mt-3 font-extrabold text-emerald-800">
                    Application Submitted!
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-700">
                    Your application has been saved.
                    Status: Pending.
                  </p>

                  <Link
                    href="/dashboard/student/my-applications"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 underline"
                  >
                    My Applications
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleApply}
                  className="mt-5 space-y-5"
                >
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#526275]">
                      Phone Number *
                    </span>

                    <input
                      type="tel"
                      required
                      minLength={6}
                      maxLength={25}
                      value={studentPhone}
                      onChange={(event) =>
                        setStudentPhone(event.target.value)
                      }
                      placeholder="01XXXXXXXXX"
                      className="h-12 w-full rounded-xl border border-[#dce4e1] px-4 text-sm outline-none focus:border-[#e97c53]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#526275]">
                      Preferred Schedule *
                    </span>

                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={200}
                      value={preferredSchedule}
                      onChange={(event) =>
                        setPreferredSchedule(event.target.value)
                      }
                      placeholder="Friday 5 PM"
                      className="h-12 w-full rounded-xl border border-[#dce4e1] px-4 text-sm outline-none focus:border-[#e97c53]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#526275]">
                      Learning Note (Optional)
                    </span>

                    <textarea
                      rows={4}
                      maxLength={1000}
                      value={studentNote}
                      onChange={(event) =>
                        setStudentNote(event.target.value)
                      }
                      placeholder="Tell the tutor about your learning goals..."
                      className="w-full resize-y rounded-xl border border-[#dce4e1] px-4 py-3 text-sm outline-none focus:border-[#e97c53]"
                    />
                  </label>

                  {applyError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                      {applyError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      submitting || alreadyApplied
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14243a] px-5 py-4 text-sm font-bold text-white hover:bg-[#253c59] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Submitting...
                      </>
                    ) : alreadyApplied ? (
                      "Already Applied"
                    ) : (
                      <>
                        Apply Now
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-6 text-[#81909a]">
                    Your application will be reviewed
                    by the tutor.
                  </p>
                </form>
              )}
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
