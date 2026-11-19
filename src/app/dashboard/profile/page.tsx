
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useToast } from "@/components/ui/toast-provider";

type UserRole = "student" | "tutor" | "admin";

type Profile = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  role: UserRole;
  plan: "free" | "pro";
  imageUrl: string;
};

type EditableField = "name" | "phone" | "bio" | "imageUrl";

type ProfileErrors = Partial<
  Record<EditableField | "image", string>
>;

const initialProfile: Profile = {
  name: "Demo MentorLagbe User",
  email: "demo@example.com",
  phone: "01712345678",
  bio: "Passionate about learning, mentorship and personal growth.",
  role: "student",
  plan: "free",
  imageUrl: "",
};

const fieldStyle =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14243a] outline-none transition focus:border-[#e97c53] focus:ring-2 focus:ring-orange-100";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function validateProfile(profile: Profile): ProfileErrors {
  const nextErrors: ProfileErrors = {};

  if (profile.name.trim().length < 3) {
    nextErrors.name =
      "Full name must contain at least 3 characters.";
  }

  if (
    profile.phone.trim() &&
    !/^(?:\+?88)?01[3-9]\d{8}$/.test(profile.phone.trim())
  ) {
    nextErrors.phone =
      "Enter a valid Bangladesh mobile number.";
  }

  if (profile.bio.trim().length > 500) {
    nextErrors.bio =
      "Bio cannot contain more than 500 characters.";
  }

  if (profile.imageUrl.trim()) {
    try {
      const url = new URL(profile.imageUrl.trim());

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        nextErrors.imageUrl =
          "Enter a valid HTTP or HTTPS image URL.";
      }
    } catch {
      nextErrors.imageUrl = "Enter a valid image URL.";
    }
  }

  return nextErrors;
}

export default function UpdateProfilePage() {
  const toast = useToast();

  const [profile, setProfile] = useState<Profile>({
    ...initialProfile,
  });

  const [savedProfile, setSavedProfile] = useState<Profile>({
    ...initialProfile,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [savedPreviewImage, setSavedPreviewImage] =
    useState("");

  const [selectedFileName, setSelectedFileName] =
    useState("");

  const [imageFailed, setImageFailed] = useState(false);

  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    return () => {
      if (previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const displayedImage = previewImage || profile.imageUrl;
  const hasImage = Boolean(displayedImage) && !imageFailed;

  function updateField(
    field: EditableField,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    if (field === "imageUrl") {
      setImageFailed(false);
    }
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      const message =
        "Only JPG, PNG or WebP images are allowed.";

      setErrors((current) => ({
        ...current,
        image: message,
      }));

      toast.warning({
        title: "Unsupported Image Format",
        description: message,
      });

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      const message = "Image size must not exceed 2 MB.";

      setErrors((current) => ({
        ...current,
        image: message,
      }));

      toast.warning({
        title: "Image Is Too Large",
        description: message,
      });

      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewImage(objectUrl);
    setSelectedFileName(file.name);
    setImageFailed(false);

    setProfile((current) => ({
      ...current,
      imageUrl: "",
    }));

    setErrors((current) => ({
      ...current,
      image: undefined,
      imageUrl: undefined,
    }));

    toast.info({
      title: "Photo Selected",
      description:
        "Your photo is previewed locally. It has not been uploaded.",
    });

    event.target.value = "";
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateProfile(profile);

    setErrors(nextErrors);

    const firstError = Object.values(nextErrors)[0];

    if (firstError) {
      toast.error({
        title: "Please Check Your Information",
        description: firstError,
      });

      return;
    }

    const updatedProfile: Profile = {
      ...profile,
      name: profile.name.trim(),
      phone: profile.phone.trim(),
      bio: profile.bio.trim(),
      imageUrl: profile.imageUrl.trim(),
    };

    setProfile(updatedProfile);
    setSavedProfile(updatedProfile);
    setSavedPreviewImage(previewImage);

    toast.success({
      title: "Demo Profile Updated",
      description:
        "Changes are saved only in this page's temporary state. Refreshing will reset them.",
    });
  }

  function resetProfile() {
    setProfile({ ...initialProfile });
    setSavedProfile({ ...initialProfile });

    setPreviewImage("");
    setSavedPreviewImage("");
    setSelectedFileName("");
    setImageFailed(false);
    setErrors({});

    toast.info({
      title: "Demo Profile Reset",
      description:
        "The original demo information has been restored.",
    });
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Page header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#e97c53]">
              Account Settings
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#14243a]">
              Update Profile
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Preview and edit your profile information.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
            <ShieldCheck size={18} />
            Demo Mode
          </div>
        </header>

        {/* Demo explanation */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Frontend Preview:</strong> The form is
          interactive, but it does not update an
          authenticated account or database. Uploaded
          images are previewed locally and are not sent
          to ImgBB.
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile card */}
          <aside className="self-start rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#e3f4e8] bg-[#14243a] text-white">
                {hasImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedImage}
                    alt="Selected profile preview"
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-extrabold">
                    {getInitials(profile.name) || (
                      <UserRound size={34} />
                    )}
                  </span>
                )}
              </div>

              <h2 className="mt-4 break-words text-lg font-extrabold text-[#14243a]">
                {profile.name || "Your Name"}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {profile.email}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-[#e3f4e8] px-3 py-1 text-xs font-bold capitalize text-emerald-800">
                  {profile.role}
                </span>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase text-orange-800">
                  {profile.plan} Plan
                </span>
              </div>

              <p className="mt-5 text-xs leading-6 text-slate-500">
                {profile.bio ||
                  "Your profile bio will appear here."}
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">
                Last saved demo name
              </p>

              <p className="mt-2 break-words text-sm font-semibold text-[#14243a]">
                {savedProfile.name}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {savedPreviewImage
                  ? "A local demo photo was selected."
                  : "No local demo photo saved."}
              </p>
            </div>
          </aside>

          {/* Edit form */}
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Personal Information
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fields marked with * are required.
              </p>
            </div>

            <form
              onSubmit={saveProfile}
              noValidate
              className="space-y-5"
            >
              {/* Full name */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-bold text-[#14243a]"
                >
                  Full Name *
                </label>

                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  value={profile.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "name-error" : undefined
                  }
                  className={fieldStyle}
                  placeholder="Enter your full name"
                  required
                />

                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="mt-2 text-xs text-red-600"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-bold text-[#14243a]"
                >
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${fieldStyle} cursor-not-allowed bg-slate-50 text-slate-500`}
                />

                <p className="mt-2 text-xs text-slate-500">
                  Email is read-only in this preview.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-2 block text-sm font-bold text-[#14243a]"
                >
                  Phone Number
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  autoComplete="tel"
                  value={profile.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone ? "phone-error" : undefined
                  }
                  className={fieldStyle}
                  placeholder="01XXXXXXXXX"
                />

                {errors.phone && (
                  <p
                    id="phone-error"
                    role="alert"
                    className="mt-2 text-xs text-red-600"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="profile-bio"
                    className="text-sm font-bold text-[#14243a]"
                  >
                    About / Bio
                  </label>

                  <span className="text-xs text-slate-400">
                    {profile.bio.length}/500
                  </span>
                </div>

                <textarea
                  id="profile-bio"
                  rows={5}
                  maxLength={500}
                  value={profile.bio}
                  onChange={(event) =>
                    updateField("bio", event.target.value)
                  }
                  className={fieldStyle}
                  placeholder="Tell others about yourself..."
                />

                {errors.bio && (
                  <p
                    role="alert"
                    className="mt-2 text-xs text-red-600"
                  >
                    {errors.bio}
                  </p>
                )}
              </div>

              {/* Photo upload */}
              <div>
                <label
                  htmlFor="profile-image"
                  className="mb-2 block text-sm font-bold text-[#14243a]"
                >
                  Profile Picture
                </label>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-xl bg-[#fff0e7] p-3 text-[#e97c53]">
                      <Camera size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#14243a]">
                        Choose a photo
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG or WebP - Maximum 2 MB
                      </p>
                    </div>
                  </div>

                  <input
                    id="profile-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selectImage}
                    className="mt-4 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#14243a] file:px-4 file:py-2 file:font-bold file:text-white"
                  />

                  {selectedFileName && (
                    <p className="mt-3 break-all text-xs text-slate-600">
                      Selected: {selectedFileName}
                    </p>
                  )}

                  {errors.image && (
                    <p
                      role="alert"
                      className="mt-2 text-xs text-red-600"
                    >
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="profile-image-url"
                  className="mb-2 block text-sm font-bold text-[#14243a]"
                >
                  Or Use an Image URL
                </label>

                <input
                  id="profile-image-url"
                  type="text"
                  inputMode="url"
                  value={profile.imageUrl}
                  onChange={(event) => {
                    setPreviewImage("");
                    setSelectedFileName("");
                    updateField(
                      "imageUrl",
                      event.target.value
                    );
                  }}
                  aria-invalid={Boolean(errors.imageUrl)}
                  aria-describedby={
                    errors.imageUrl
                      ? "image-url-error"
                      : undefined
                  }
                  className={fieldStyle}
                  placeholder="https://example.com/profile.jpg"
                />

                {errors.imageUrl && (
                  <p
                    id="image-url-error"
                    role="alert"
                    className="mt-2 text-xs text-red-600"
                  >
                    {errors.imageUrl}
                  </p>
                )}
              </div>

              {/* Account information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-role"
                    className="mb-2 block text-sm font-bold text-[#14243a]"
                  >
                    Account Role
                  </label>

                  <input
                    id="profile-role"
                    value={profile.role}
                    disabled
                    className={`${fieldStyle} cursor-not-allowed bg-slate-50 capitalize`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-plan"
                    className="mb-2 block text-sm font-bold text-[#14243a]"
                  >
                    Subscription Plan
                  </label>

                  <input
                    id="profile-plan"
                    value={profile.plan}
                    disabled
                    className={`${fieldStyle} cursor-not-allowed bg-slate-50 capitalize`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={resetProfile}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw size={17} />
                  Reset Demo
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d96c45]"
                >
                  <Save size={17} />
                  Save Demo Profile
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="rounded-2xl bg-[#e3f4e8] p-5 text-sm leading-6 text-slate-700">
          <strong>Next Integration:</strong> Better Auth
          will supply the logged-in user. The backend
          will securely update profile information,
          while ImgBB will store uploaded photos.
        </div>
      </div>
    </main>
  );
}
