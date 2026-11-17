
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

type SubmittedPreview = TuitionForm & {
  bannerName: string | null;
};

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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

export default function PostTuitionPage() {
  const [form, setForm] = useState<TuitionForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [submitted, setSubmitted] =
    useState<SubmittedPreview | null>(null);

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

    setSubmitted(null);
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
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
        banner: "Please select a JPG, PNG or WEBP image.",
      }));

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        banner: "Image size must be 5 MB or less.",
      }));

      event.target.value = "";
      return;
    }

    setBanner(file);
    setBannerPreview("");
    setSubmitted(null);

    setErrors((previous) => ({
      ...previous,
      banner: undefined,
    }));

    event.target.value = "";
  }

  function removeBanner() {
    setBanner(null);
    setBannerPreview("");
    setSubmitted(null);
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Tuition title is required.";
    } else if (form.title.trim().length < 8) {
      nextErrors.title = "Enter at least 8 characters.";
    }

    if (!form.subject) {
      nextErrors.subject = "Please select a subject.";
    }

    if (!form.classLevel) {
      nextErrors.classLevel = "Please select a class level.";
    }

    if (form.mode === "Offline" && !form.location.trim()) {
      nextErrors.location =
        "Location is required for offline tuition.";
    }

    const fee = Number(form.monthlyFee);

    if (!form.monthlyFee.trim()) {
      nextErrors.monthlyFee = "Monthly fee is required.";
    } else if (!Number.isFinite(fee) || fee <= 0) {
      nextErrors.monthlyFee =
        "Monthly fee must be greater than zero.";
    } else if (!Number.isInteger(fee)) {
      nextErrors.monthlyFee =
        "Enter the fee as a whole number.";
    }

    const days = Number(form.daysPerWeek);

    if (!form.daysPerWeek) {
      nextErrors.daysPerWeek =
        "Please select the number of days.";
    } else if (
      !Number.isInteger(days) ||
      days < 1 ||
      days > 7
    ) {
      nextErrors.daysPerWeek =
        "Choose between 1 and 7 days.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (form.description.trim().length < 30) {
      nextErrors.description =
        "Description must contain at least 30 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitted(null);

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    setSubmitted({
      ...form,
      title: form.title.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      bannerName: banner?.name ?? null,
    });
  }

  function handleReset() {
    setForm({ ...initialForm });
    setErrors({});
    setBanner(null);
    setBannerPreview("");
    setSubmitted(null);
  }

  return (
    <div className="min-h-screen bg-[#fffaf6]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7">
          <Link
            href="/dashboard/tutor"
            className="text-sm font-medium text-slate-500 transition hover:text-[#e97c53]"
          >
            ← Back to Tutor Dashboard
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#e3f4e8] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#28765b]">
              Tutor Workspace
            </span>

            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              Demo Mode
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#14243a] sm:text-4xl">
            Post a New Tuition
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Create a clear and engaging tuition listing so
            students can discover the right learning opportunity.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_310px]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >
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
                    Tell students what you are offering.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className={labelClass}>
                    Tuition Title{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="title"
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="e.g. Experienced Math Tutor for Class 9"
                    className={inputClass}
                    maxLength={120}
                  />

                  <FieldError message={errors.title} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="subject"
                      className={labelClass}
                    >
                      Subject{" "}
                      <span className="text-red-500">*</span>
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
                        Select a subject
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
                      Class Level{" "}
                      <span className="text-red-500">*</span>
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
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>

                    <FieldError message={errors.classLevel} />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-7 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e7] font-bold text-[#e97c53]">
                  02
                </span>

                <div>
                  <h2 className="text-xl font-bold text-[#14243a]">
                    Learning Arrangement
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose how and where classes will happen.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <span className={labelClass}>
                    Tuition Mode{" "}
                    <span className="text-red-500">*</span>
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    {(["Online", "Offline"] as const).map(
                      (mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() =>
                            updateField("mode", mode)
                          }
                          aria-pressed={form.mode === mode}
                          className={`rounded-xl border px-4 py-4 text-sm font-bold transition ${
                            form.mode === mode
                              ? "border-[#e97c53] bg-[#fff0e7] text-[#b64d2b]"
                              : "border-slate-200 bg-white text-slate-600 hover:border-orange-200"
                          }`}
                        >
                          {mode === "Online"
                            ? "💻 Online"
                            : "🏡 Offline"}
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
                    {form.mode === "Offline" ? (
                      <span className="text-red-500">*</span>
                    ) : (
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    )}
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
                        ? "e.g. Dhanmondi, Dhaka"
                        : "e.g. Available across Bangladesh"
                    }
                    className={inputClass}
                  />

                  <FieldError message={errors.location} />

                  <p className="mt-2 text-xs text-slate-400">
                    Offline tuition requires a location.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="monthlyFee"
                      className={labelClass}
                    >
                      Monthly Fee (৳){" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="monthlyFee"
                      type="number"
                      min="1"
                      step="1"
                      value={form.monthlyFee}
                      onChange={(event) =>
                        updateField(
                          "monthlyFee",
                          event.target.value
                        )
                      }
                      placeholder="e.g. 5000"
                      className={inputClass}
                    />

                    <FieldError message={errors.monthlyFee} />
                  </div>

                  <div>
                    <label
                      htmlFor="daysPerWeek"
                      className={labelClass}
                    >
                      Days Per Week{" "}
                      <span className="text-red-500">*</span>
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

                      {Array.from(
                        { length: 7 },
                        (_, index) => index + 1
                      ).map((day) => (
                        <option
                          key={day}
                          value={String(day)}
                        >
                          {day}{" "}
                          {day === 1 ? "day" : "days"}
                        </option>
                      ))}
                    </select>

                    <FieldError
                      message={errors.daysPerWeek}
                    />
                  </div>
                </div>
              </div>
            </section>

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
                    Tuition Description{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="description"
                    rows={6}
                    maxLength={2000}
                    value={form.description}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Describe your teaching approach, experience, class schedule and what students can expect..."
                    className={`${inputClass} resize-y`}
                  />

                  <div className="mt-1 flex justify-between gap-3">
                    <FieldError
                      message={errors.description}
                    />

                    <span className="ml-auto text-xs text-slate-400">
                      {form.description.length}/2000
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="banner"
                    className={labelClass}
                  >
                    Tuition Banner{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  {banner && bannerPreview ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <div
                        role="img"
                        aria-label="Selected tuition banner preview"
                        className="h-56 w-full bg-slate-100 bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url("${bannerPreview}")`,
                        }}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-3">
                        <p className="max-w-xs truncate text-xs text-slate-600">
                          {banner.name}
                        </p>

                        <button
                          type="button"
                          onClick={removeBanner}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="banner"
                      className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-[#fffaf6] px-5 py-8 text-center transition hover:bg-orange-50"
                    >
                      <span className="mb-3 text-3xl">
                        🖼️
                      </span>

                      <span className="text-sm font-bold text-[#14243a]">
                        Click to upload a banner
                      </span>

                      <span className="mt-2 text-xs text-slate-500">
                        JPG, PNG or WEBP · Max 5 MB
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
                      className="mt-3 inline-block cursor-pointer text-xs font-semibold text-[#e97c53] hover:underline"
                    >
                      Choose another image
                    </label>
                  )}

                  <FieldError message={errors.banner} />

                  <p className="mt-2 text-xs text-slate-400">
                    The image is previewed locally only.
                    ImgBB upload will be connected later.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-5">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset Form
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#e97c53] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#d96c45]"
              >
                Validate & Preview →
              </button>
            </div>

            {submitted && (
              <section
                role="status"
                className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Validation Successful
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#14243a]">
                  Your tuition preview is ready!
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  All required fields passed validation.
                  This listing has NOT been saved or
                  published because the database is
                  currently disabled.
                </p>

                <div className="mt-5 space-y-2 rounded-2xl bg-white p-4 text-sm text-slate-700">
                  <p>
                    <strong>Title:</strong>{" "}
                    {submitted.title}
                  </p>

                  <p>
                    <strong>Subject:</strong>{" "}
                    {submitted.subject}
                  </p>

                  <p>
                    <strong>Class:</strong>{" "}
                    {submitted.classLevel}
                  </p>

                  <p>
                    <strong>Mode:</strong>{" "}
                    {submitted.mode}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {submitted.location || "Not specified"}
                  </p>

                  <p>
                    <strong>Monthly Fee:</strong> ৳
                    {Number(
                      submitted.monthlyFee
                    ).toLocaleString("en-BD")}
                  </p>

                  <p>
                    <strong>Days/Week:</strong>{" "}
                    {submitted.daysPerWeek}
                  </p>

                  <p>
                    <strong>Banner:</strong>{" "}
                    {submitted.bannerName ||
                      "No banner selected"}
                  </p>

                  <p className="break-words">
                    <strong>Description:</strong>{" "}
                    {submitted.description}
                  </p>
                </div>
              </section>
            )}
          </form>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-[#14243a] p-6 text-white">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                ✨
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
                <p>✓ Write a specific title</p>
                <p>✓ Choose the correct class level</p>
                <p>✓ Set a realistic monthly fee</p>
                <p>✓ Explain your teaching approach</p>
                <p>✓ Add a clear banner image</p>
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
                className="mt-6 inline-flex text-sm font-bold text-[#e97c53] hover:underline"
              >
                View Plans →
              </Link>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Plan limits will be enforced by the
                backend once authentication and database
                integration are complete.
              </p>
            </div>

            <div className="rounded-3xl border border-[#cae8d3] bg-[#e3f4e8] p-6">
              <h3 className="font-bold text-[#14243a]">
                Preview Mode
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Form validation works now. Tuition
                publishing, ImgBB uploads and account
                checks are not enabled yet.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
