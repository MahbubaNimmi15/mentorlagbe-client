
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ImagePlus,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";

import { useToast } from "@/components/ui/toast-provider";

type TuitionMode = "Online" | "Offline";

type TuitionForm = {
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: string;
  daysPerWeek: string;
  description: string;
};

type FormErrors = Partial<
  Record<keyof TuitionForm | "banner", string>
>;

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const subjects = [
  "Mathematics",
  "English",
  "Bangla",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "Accounting",
  "Economics",
  "General Science",
  "All Subjects",
  "Other",
];

const classLevels = [
  "Class 1 - 5",
  "Class 6 - 8",
  "Class 9 - 10",
  "SSC",
  "HSC",
  "Admission Preparation",
  "University",
  "Other",
];

const initialForm: TuitionForm = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Online",
  location: "",
  monthlyFee: "",
  daysPerWeek: "",
  description: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-800";

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="mt-1.5 text-xs font-medium text-red-600"
    >
      {message}
    </p>
  );
}

function validateForm(
  form: TuitionForm
): FormErrors {
  const errors: FormErrors = {};

  const title = form.title.trim();
  const location = form.location.trim();
  const description = form.description.trim();

  if (title.length < 8 || title.length > 150) {
    errors.title = "Title must contain 8 to 150 characters.";
  }

  if (!form.subject) {
    errors.subject = "Please select a subject.";
  }

  if (!form.classLevel) {
    errors.classLevel = "Please select a class level.";
  }

  if (
    form.mode === "Offline" &&
    location.length < 2
  ) {
    errors.location =
      "Location is required for offline tuition.";
  }

  if (location.length > 200) {
    errors.location =
      "Location cannot exceed 200 characters.";
  }

  const fee = Number(form.monthlyFee);

  if (!form.monthlyFee.trim()) {
    errors.monthlyFee = "Monthly fee is required.";
  } else if (
    !Number.isInteger(fee) ||
    fee <= 0 ||
    fee > 1000000
  ) {
    errors.monthlyFee =
      "Enter a whole number between 1 and 1000000.";
  }

  const days = Number(form.daysPerWeek);

  if (
    !form.daysPerWeek ||
    !Number.isInteger(days) ||
    days < 1 ||
    days > 7
  ) {
    errors.daysPerWeek =
      "Please choose between 1 and 7 days.";
  }

  if (
    description.length < 30 ||
    description.length > 1900
  ) {
    errors.description =
      "Description must contain 30 to 1900 characters.";
  }

  return errors;
}

export default function PostTuitionPage() {
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] =
    useState<TuitionForm>({ ...initialForm });

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [banner, setBanner] =
    useState<File | null>(null);

  const [bannerPreview, setBannerPreview] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  useEffect(() => {
    if (!banner) {
      return;
    }

    const objectUrl = URL.createObjectURL(banner);
    setBannerPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [banner]);

  function updateField<K extends keyof TuitionForm>(
    field: K,
    value: TuitionForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setServerError("");
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        banner: "Select a JPG, PNG or WebP image.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        banner: "Image must be 5 MB or less.",
      }));
      event.target.value = "";
      return;
    }

    setBanner(file);

    setErrors((previous) => ({
      ...previous,
      banner: undefined,
    }));

    toast.info({
      title: "Banner Selected",
      description:
        "Image preview is local only. Upload is not connected yet.",
    });

    event.target.value = "";
  }

  function removeBanner() {
    setBanner(null);
    setBannerPreview("");
  }

  function handleReset() {
    if (submitting) return;

    setForm({ ...initialForm });
    setErrors({});
    setBanner(null);
    setBannerPreview("");
    setServerError("");

    toast.info({
      title: "Form Reset",
      description: "Form information has been cleared.",
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return;

    setServerError("");

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    const firstError =
      Object.values(nextErrors)[0];

    if (firstError) {
      toast.error({
        title: "Please Complete the Form",
        description: firstError,
      });

      const firstField =
        Object.keys(nextErrors)[0];

      const element =
        document.getElementById(firstField);

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element?.focus({ preventScroll: true });
      return;
    }

    setSubmitting(true);

    try {
      const saved = sessionStorage.getItem(
        "mentorlagbe_auth"
      );

      if (!saved) {
        throw new Error(
          "Please sign in with your tutor account."
        );
      }

      let token = "";

      try {
        const session = JSON.parse(saved) as {
          token?: string;
        };

        token = session.token || "";
      } catch {
        throw new Error(
          "Invalid login session. Please sign in again."
        );
      }

      if (!token) {
        throw new Error(
          "Authentication token missing. Please sign in again."
        );
      }

      // Current backend accepts:
      // title, subject, classLevel, location,
      // salary and requirements.
      //
      // Preserve mode, days and description
      // inside requirements until the database
      // schema supports separate fields.

      const requirements = [
        `Tuition Mode: ${form.mode}`,
        `Days Per Week: ${form.daysPerWeek}`,
        "",
        form.description.trim(),
      ].join("\n");

      const payload = {
        title: form.title.trim(),
        subject: form.subject,
        classLevel: form.classLevel,
        location:
          form.location.trim() ||
          "Online - Bangladesh",
        salary: Number(form.monthlyFee),
        requirements,
      };

      const response = await fetch(
        `${API_URL}/api/tuitions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        tuition?: {
          id: string;
          status: string;
        };
      };

      if (!response.ok || !result.success) {
        if (response.status === 401) {
          throw new Error(
            "Your session expired. Please sign in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Only tutor accounts can create tuition posts."
          );
        }

        throw new Error(
          result.message ||
          "Unable to create tuition."
        );
      }

      toast.success({
        title: "Tuition Submitted",
        description:
          "Your tuition was saved to MongoDB and is pending admin approval.",
      });

      router.push("/dashboard/tutor/my-tuitions");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit tuition.";

      setServerError(message);

      toast.error({
        title: "Tuition Submission Failed",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf6]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-7">
          <Link
            href="/dashboard/tutor"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#e97c53]"
          >
            <ArrowLeft size={17} />
            Back to Tutor Dashboard
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e97c53]">
                Tutor Workspace
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-[#14243a]">
                Post New Tuition
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Complete the form to submit your
                tuition listing for admin approval.
              </p>
            </div>

            <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-emerald-800">
              MongoDB Submission
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="min-w-0 space-y-6"
          >
            {/* Section 01 */}
            <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-7 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e7] font-bold text-[#e97c53]">
                  01
                </span>

                <div>
                  <h2 className="text-xl font-bold text-[#14243a]">
                    Tuition Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Start with the core details of your listing.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className={labelClass}
                  >
                    Tuition Title *
                  </label>

                  <input
                    id="title"
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                    aria-invalid={Boolean(errors.title)}
                    placeholder="Experienced Mathematics Tutor for Class 9"
                    className={inputClass}
                  />

                  <FieldError message={errors.title} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="subject"
                      className={labelClass}
                    >
                      Subject *
                    </label>

                    <select
                      id="subject"
                      value={form.subject}
                      onChange={(event) =>
                        updateField(
                          "subject",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select subject
                      </option>

                      {subjects.map((subject) => (
                        <option
                          key={subject}
                          value={subject}
                        >
                          {subject}
                        </option>
                      ))}
                    </select>

                    <FieldError message={errors.subject} />
                  </div>

                  <div>
                    <label
                      htmlFor="classLevel"
                      className={labelClass}
                    >
                      Class Level *
                    </label>

                    <select
                      id="classLevel"
                      value={form.classLevel}
                      onChange={(event) =>
                        updateField(
                          "classLevel",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select class level
                      </option>

                      {classLevels.map((level) => (
                        <option
                          key={level}
                          value={level}
                        >
                          {level}
                        </option>
                      ))}
                    </select>

                    <FieldError message={errors.classLevel} />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 02 */}
            <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-7 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e7] font-bold text-[#e97c53]">
                  02
                </span>

                <div>
                  <h2 className="text-xl font-bold text-[#14243a]">
                    Schedule & Location
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Let students know where and when you teach.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className={labelClass}>
                    Tuition Mode *
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {(["Online", "Offline"] as const).map(
                      (mode) => (
                        <button
                          key={mode}
                          type="button"
                          aria-pressed={form.mode === mode}
                          onClick={() =>
                            updateField("mode", mode)
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            form.mode === mode
                              ? "border-[#e97c53] bg-[#fff0e7] text-[#b45332]"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {mode}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className={labelClass}
                  >
                    Location{" "}
                    {form.mode === "Offline"
                      ? "*"
                      : "(Optional)"}
                  </label>

                  <input
                    id="location"
                    value={form.location}
                    onChange={(event) =>
                      updateField(
                        "location",
                        event.target.value
                      )
                    }
                    placeholder={
                      form.mode === "Offline"
                        ? "Dhanmondi, Dhaka"
                        : "Available across Bangladesh"
                    }
                    className={inputClass}
                  />

                  <FieldError message={errors.location} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="monthlyFee"
                      className={labelClass}
                    >
                      Monthly Fee (BDT) *
                    </label>

                    <input
                      id="monthlyFee"
                      type="number"
                      min="1"
                      max="1000000"
                      step="1"
                      value={form.monthlyFee}
                      onChange={(event) =>
                        updateField(
                          "monthlyFee",
                          event.target.value
                        )
                      }
                      placeholder="5000"
                      className={inputClass}
                    />

                    <FieldError message={errors.monthlyFee} />
                  </div>

                  <div>
                    <label
                      htmlFor="daysPerWeek"
                      className={labelClass}
                    >
                      Days Per Week *
                    </label>

                    <select
                      id="daysPerWeek"
                      value={form.daysPerWeek}
                      onChange={(event) =>
                        updateField(
                          "daysPerWeek",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select days
                      </option>

                      {[1, 2, 3, 4, 5, 6, 7].map(
                        (day) => (
                          <option
                            key={day}
                            value={String(day)}
                          >
                            {day}{" "}
                            {day === 1 ? "day" : "days"}
                          </option>
                        )
                      )}
                    </select>

                    <FieldError message={errors.daysPerWeek} />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 03 */}
            <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-7 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e7] font-bold text-[#e97c53]">
                  03
                </span>

                <div>
                  <h2 className="text-xl font-bold text-[#14243a]">
                    Description & Banner
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Give your listing a personal touch.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="description"
                    className={labelClass}
                  >
                    Tuition Description *
                  </label>

                  <textarea
                    id="description"
                    rows={6}
                    maxLength={1900}
                    value={form.description}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Describe your teaching approach, experience and class schedule..."
                    className={`${inputClass} resize-y`}
                  />

                  <FieldError message={errors.description} />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.description.length}/1900
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="banner"
                    className={labelClass}
                  >
                    Tuition Banner (Optional)
                  </label>

                  {banner && bannerPreview ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <div
                        role="img"
                        aria-label="Selected banner preview"
                        className="h-56 w-full bg-slate-100 bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage:
                            `url("${bannerPreview}")`,
                        }}
                      />

                      <div className="flex items-center justify-between gap-3 p-3">
                        <p className="truncate text-xs text-slate-600">
                          {banner.name}
                        </p>

                        <button
                          type="button"
                          onClick={removeBanner}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="banner"
                      className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-[#fffaf6] px-5 py-8 text-center"
                    >
                      <ImagePlus
                        size={32}
                        className="mb-3 text-[#e97c53]"
                      />

                      <span className="text-sm font-bold text-[#14243a]">
                        Click to select a banner
                      </span>

                      <span className="mt-2 text-xs text-slate-500">
                        JPG, PNG or WebP - Max 5 MB
                      </span>
                    </label>
                  )}

                  <input
                    id="banner"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="sr-only"
                  />

                  {banner && (
                    <label
                      htmlFor="banner"
                      className="mt-3 inline-block cursor-pointer text-xs font-semibold text-[#e97c53]"
                    >
                      Choose another image
                    </label>
                  )}

                  <FieldError message={errors.banner} />

                  <p className="mt-2 text-xs text-slate-400">
                    Banner is previewed locally only.
                    It is not uploaded or saved to MongoDB.
                  </p>
                </div>
              </div>
            </section>

            {/* Actions */}
            {serverError && (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
              >
                {serverError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-5">
              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                <RotateCcw size={17} />
                Reset Form
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#d96c45] disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Tuition"}
                <ArrowRight size={17} />
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-[#14243a] p-6 text-white">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles
                  size={25}
                  className="text-[#ffb491]"
                />
              </div>

              <h2 className="text-xl font-bold">
                Make your listing stand out
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                A detailed tuition listing helps students
                understand your subject, availability
                and teaching style.
              </p>

              <div className="mt-6 space-y-4 text-sm text-slate-200">
                {[
                  "Write a specific title",
                  "Choose the correct class level",
                  "Set a realistic monthly fee",
                  "Explain your teaching approach",
                  "Add a clear banner image",
                ].map((tip) => (
                  <p
                    key={tip}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#ffb491]"
                    />
                    {tip}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#e97c53]">
                Tuition Posting Plans
              </p>

              <h3 className="mt-3 text-lg font-bold text-[#14243a]">
                Free vs Pro
              </h3>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="font-bold text-slate-800">
                    Free Tutor
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Up to 2 tuition listings
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="font-bold text-slate-800">
                    Tutor Pro
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Unlimited tuition listings
                  </p>
                </div>
              </div>

              <Link
                href="/pricing"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#e97c53]"
              >
                View Plans
                <ArrowRight size={16} />
              </Link>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Plan limits are not enforced by the backend yet.
              </p>
            </div>

            <div className="rounded-3xl border border-[#cae8d3] bg-[#e3f4e8] p-6">
              <div className="flex items-center gap-2">
                <BookOpen
                  size={19}
                  className="text-emerald-700"
                />

                <h3 className="font-bold text-[#14243a]">
                  Real Submission
                </h3>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tuition details are saved to MongoDB
                with pending approval status.
                Banner uploads and subscription
                limits are not connected yet.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
