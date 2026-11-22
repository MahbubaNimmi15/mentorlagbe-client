
"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImageIcon,
  Loader2,
  RotateCcw,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";

type Role = "student" | "tutor" | "admin";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  bio: string;
  imageUrl: string;
  plan: string;
};

type Session = {
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: Role;
  };
};

type ProfileResponse = {
  success?: boolean;
  message?: string;
  profile?: Profile;
  imageUrl?: string;
  errors?: Record<string, string[]>;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const fieldStyle =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14243a] outline-none focus:border-[#e97c53] focus:ring-2 focus:ring-orange-100";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function validateProfile(profile: Profile) {
  if (profile.name.trim().length < 3) {
    return "Name must contain at least 3 characters.";
  }

  if (
    profile.phone.trim() &&
    !/^(?:\+?88)?01[3-9]\d{8}$/.test(
      profile.phone.trim()
    )
  ) {
    return "Enter a valid Bangladesh mobile number.";
  }

  if (profile.bio.trim().length > 500) {
    return "Bio cannot exceed 500 characters.";
  }

  if (profile.imageUrl.trim()) {
    try {
      const url = new URL(profile.imageUrl.trim());

      if (!["http:", "https:"].includes(url.protocol)) {
        return "Image URL must start with http or https.";
      }
    } catch {
      return "Enter a valid image URL.";
    }
  }

  return "";
}

export default function UpdateProfilePage() {
  const [token, setToken] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [savedProfile, setSavedProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imageFailed, setImageFailed] = useState(false);

  // Revoke temporary image preview URLs.
  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Read login token.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(
        "mentorlagbe_auth"
      );

      if (saved) {
        const session = JSON.parse(saved) as Session;
        setToken(session.token || "");
      }
    } catch {
      setToken("");
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // Load MongoDB profile.
  const loadProfile = useCallback(
    async (signal?: AbortSignal) => {
      if (!token) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal,
          }
        );

        const result =
          (await response.json()) as ProfileResponse;

        if (
          !response.ok ||
          !result.success ||
          !result.profile
        ) {
          throw new Error(
            result.message || "Unable to load profile."
          );
        }

        if (!signal?.aborted) {
          setProfile(result.profile);
          setSavedProfile(result.profile);
          setImageFailed(false);
        }
      } catch (err) {
        if (!signal?.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load profile."
          );
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [token]
  );

  useEffect(() => {
    if (!authChecked || !token) return;

    const controller = new AbortController();

    void loadProfile(controller.signal);

    return () => controller.abort();
  }, [authChecked, token, loadProfile]);

  function updateField(
    field: "name" | "phone" | "bio" | "imageUrl",
    value: string
  ) {
    setProfile((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );

    setError("");
    setSuccess("");

    if (field === "imageUrl") {
      setImageFailed(false);
    }
  }

  // Choose a local image.
  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WebP images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be 2 MB or smaller.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageFailed(false);
    setError("");
    setSuccess("");
  }

  // Upload selected photo to ImgBB via our backend.
  async function uploadPhoto() {
    if (!selectedFile || !token || uploading || saving) {
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        `${API_URL}/api/profile/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result =
        (await response.json()) as ProfileResponse;

      if (
        !response.ok ||
        !result.success ||
        !result.imageUrl
      ) {
        throw new Error(
          result.message || "Image upload failed."
        );
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              imageUrl: result.imageUrl!,
            }
          : current
      );

      setSelectedFile(null);
      setPreviewUrl("");
      setImageFailed(false);

      setSuccess(
        "Photo uploaded to ImgBB! Now click Save Profile to save it to your account."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload photo."
      );
    } finally {
      setUploading(false);
    }
  }

  function resetChanges() {
    if (!savedProfile || uploading || saving) return;

    setProfile({ ...savedProfile });
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setSuccess("");
    setImageFailed(false);
  }

  // Save the profile and image URL to MongoDB.
  async function saveProfile(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile || !token || saving || uploading) {
      return;
    }

    if (selectedFile) {
      setError(
        "Please upload your selected photo before saving the profile."
      );
      return;
    }

    const validationError = validateProfile(profile);

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name.trim(),
            phone: profile.phone.trim(),
            bio: profile.bio.trim(),
            imageUrl: profile.imageUrl.trim(),
          }),
        }
      );

      const result =
        (await response.json()) as ProfileResponse;

      if (
        !response.ok ||
        !result.success ||
        !result.profile
      ) {
        const fieldErrors = result.errors
          ? Object.values(result.errors).flat()
          : [];

        throw new Error(
          fieldErrors[0] ||
            result.message ||
            "Profile save failed."
        );
      }

      setProfile(result.profile);
      setSavedProfile(result.profile);
      setImageFailed(false);

      // Keep browser session name in sync.
      try {
        const saved = sessionStorage.getItem(
          "mentorlagbe_auth"
        );

        if (saved) {
          const session = JSON.parse(saved) as Session;

          sessionStorage.setItem(
            "mentorlagbe_auth",
            JSON.stringify({
              ...session,
              user: {
                ...session.user,
                id: result.profile.id,
                name: result.profile.name,
                email: result.profile.email,
                role: result.profile.role,
              },
            })
          );
        }
      } catch {
        // Database update is already complete.
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!authChecked || loading) {
    return (
      <main className="min-h-[60vh] px-4 py-24 text-center">
        <Loader2
          size={32}
          className="mx-auto animate-spin text-[#e97c53]"
        />
        <p className="mt-4 text-slate-500">
          Loading your profile...
        </p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-[60vh] px-4 py-24 text-center">
        <UserRound
          size={40}
          className="mx-auto text-[#e97c53]"
        />

        <h1 className="mt-5 text-2xl font-extrabold">
          Login Required
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Sign in to update your profile.
        </p>

        <Link
          href="/sign-in"
          className="mt-6 inline-flex rounded-xl bg-[#14243a] px-6 py-3 font-bold text-white"
        >
          Sign In
        </Link>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-[60vh] px-4 py-24 text-center">
        <AlertCircle
          size={38}
          className="mx-auto text-red-500"
        />

        <h1 className="mt-4 text-2xl font-extrabold">
          Unable to Load Profile
        </h1>

        <p className="mt-3 text-sm text-red-600">
          {error || "Profile information unavailable."}
        </p>

        <button
          type="button"
          onClick={() => void loadProfile()}
          className="mt-6 rounded-xl bg-[#14243a] px-6 py-3 font-bold text-white"
        >
          Try Again
        </button>
      </main>
    );
  }

  const displayedImage = previewUrl || profile.imageUrl;
  const hasImage = Boolean(displayedImage) && !imageFailed;

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* HEADER */}

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
              Edit your details and profile photo.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-xl bg-[#e3f4e8] px-4 py-3 text-sm font-bold text-[#347457]">
            <ShieldCheck size={18} />
            Real Account
          </span>
        </header>

        {/* NOTIFICATIONS */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle
              size={18}
              className="mr-2 inline"
            />
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <CheckCircle2
              size={18}
              className="mr-2 inline"
            />
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* PROFILE CARD */}

          <aside className="self-start rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#e3f4e8] bg-[#14243a] text-white">
                {hasImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedImage}
                    alt="Your profile"
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
                {profile.name}
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

              <p className="mt-5 whitespace-pre-wrap text-xs leading-6 text-slate-500">
                {profile.bio ||
                  "Add a short bio to introduce yourself."}
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">
                Profile Storage
              </p>

              <p className="mt-2 text-sm font-semibold text-[#14243a]">
                MongoDB + ImgBB
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                Uploaded images are hosted on ImgBB.
                The saved image URL is stored in your
                MongoDB profile.
              </p>
            </div>
          </aside>

          {/* PROFILE FORM */}

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-extrabold text-[#14243a]">
              Personal Information
            </h2>

            <form
              onSubmit={saveProfile}
              className="mt-6 space-y-5"
            >
              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Full Name *
                </span>

                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  value={profile.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  className={fieldStyle}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Email Address
                </span>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${fieldStyle} cursor-not-allowed bg-slate-50`}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Phone Number
                </span>

                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="01XXXXXXXXX"
                  className={fieldStyle}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center justify-between text-sm font-bold">
                  About / Bio
                  <span className="text-xs font-normal text-slate-400">
                    {profile.bio.length}/500
                  </span>
                </span>

                <textarea
                  rows={5}
                  maxLength={500}
                  value={profile.bio}
                  onChange={(event) =>
                    updateField("bio", event.target.value)
                  }
                  className={fieldStyle}
                />
              </label>

              {/* PHOTO UPLOAD */}

              <div className="rounded-2xl border border-dashed border-[#dce4e1] bg-[#f7faf7] p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#fff0e7] p-3 text-[#e97c53]">
                    <Camera size={23} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold">
                      Profile Picture
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG, WebP · Maximum 2 MB
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectPhoto}
                  disabled={uploading || saving}
                  className="mt-5 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#14243a] file:px-4 file:py-2 file:font-bold file:text-white"
                />

                {selectedFile && (
                  <div className="mt-4">
                    <p className="break-all text-xs font-semibold text-[#526275]">
                      Selected: {selectedFile.name}
                    </p>

                    <button
                      type="button"
                      onClick={() => void uploadPhoto()}
                      disabled={uploading || saving}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#348265] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Upload size={17} />
                      )}

                      {uploading
                        ? "Uploading..."
                        : "Upload Photo"}
                    </button>
                  </div>
                )}
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <ImageIcon size={18} />
                  Profile Image URL
                </span>

                <input
                  type="url"
                  value={profile.imageUrl}
                  onChange={(event) =>
                    updateField(
                      "imageUrl",
                      event.target.value
                    )
                  }
                  placeholder="https://example.com/profile.jpg"
                  className={fieldStyle}
                />

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  This field fills automatically after a
                  successful photo upload. You can also
                  provide your own public image URL.
                </p>
              </label>

              {/* ACCOUNT INFORMATION */}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Account Role
                  </span>

                  <input
                    value={profile.role}
                    disabled
                    className={`${fieldStyle} cursor-not-allowed bg-slate-50 capitalize`}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Subscription Plan
                  </span>

                  <input
                    value={profile.plan}
                    disabled
                    className={`${fieldStyle} cursor-not-allowed bg-slate-50 capitalize`}
                  />
                </label>
              </div>

              {/* BUTTONS */}

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={resetChanges}
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
                >
                  <RotateCcw size={17} />
                  Reset Changes
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white hover:bg-[#d96c45] disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
