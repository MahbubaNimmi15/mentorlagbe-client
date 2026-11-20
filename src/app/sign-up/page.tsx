
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  UserRound,
} from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";

type Role = "student" | "tutor";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type RegisterResponse = {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
  errors?: Record<string, string[] | undefined>;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const initialValues: FormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "student",
};

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Name must have at least 2 characters.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    errors.password =
      "Password must have at least 8 characters.";
  } else if (values.password.length > 72) {
    errors.password =
      "Password must not exceed 72 characters.";
  } else if (
    !/[A-Z]/.test(values.password) ||
    !/[a-z]/.test(values.password) ||
    !/[0-9]/.test(values.password)
  ) {
    errors.password =
      "Use uppercase, lowercase, and a number.";
  }

  if (
    !values.confirmPassword ||
    values.password !== values.confirmPassword
  ) {
    errors.confirmPassword = "Your passwords must match.";
  }

  return errors;
}

export default function SignUpPage() {
  const router = useRouter();

  const [values, setValues] =
    useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isLoading) return;

    setMessage("");

    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage("Please correct the highlighted fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
            role: values.role,
          }),
          cache: "no-store",
        }
      );

      const data: RegisterResponse = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.token ||
        !data.user
      ) {
        if (data.errors) {
          const nextErrors: FormErrors = {};

          for (const key of [
            "name",
            "email",
            "password",
            "role",
          ] as const) {
            const fieldErrors = data.errors[key];

            if (fieldErrors?.length) {
              nextErrors[key] = fieldErrors[0];
            }
          }

          setErrors(nextErrors);
        }

        setMessage(
          data.message || "Unable to create account."
        );
        return;
      }

      // Temporary session for local development.
      // Production will use a secure server-managed session.
      sessionStorage.setItem(
        "mentorlagbe_auth",
        JSON.stringify({
          token: data.token,
          user: data.user,
        })
      );

      setValues((previous) => ({
        ...previous,
        password: "",
        confirmPassword: "",
      }));

      setMessage("Account created successfully!");

      const destination =
        data.user.role === "tutor"
          ? "/dashboard/tutor"
          : "/dashboard/student";

      router.push(destination);
      router.refresh();
    } catch {
      setMessage(
        "Cannot connect to the server. Check that the MentorLagbe backend is running on port 5001."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      badge="JOIN THE LEARNING COMMUNITY"
      title="Create your account."
      description="Choose your role and get ready for a smarter learning experience."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <fieldset disabled={isLoading}>
          <legend className="mb-3 text-sm font-bold text-[#36475a]">
            I want to join as
          </legend>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={values.role === "student"}
              onClick={() => updateField("role", "student")}
              className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                values.role === "student"
                  ? "border-[#e97c53] bg-[#fff2ea]"
                  : "border-[#e3e9e7] bg-white"
              }`}
            >
              <GraduationCap
                size={22}
                className="shrink-0"
              />
              <span className="text-sm font-bold">
                Student
              </span>
            </button>

            <button
              type="button"
              aria-pressed={values.role === "tutor"}
              onClick={() => updateField("role", "tutor")}
              className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                values.role === "tutor"
                  ? "border-[#e97c53] bg-[#fff2ea]"
                  : "border-[#e3e9e7] bg-white"
              }`}
            >
              <UserRound
                size={22}
                className="shrink-0"
              />
              <span className="text-sm font-bold">
                Tutor
              </span>
            </button>
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="signup-name"
            className="mb-2 block text-sm font-bold"
          >
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={values.name}
            disabled={isLoading}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            aria-invalid={Boolean(errors.name)}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-[#dce4e1] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#e97c53]"
          />
          {errors.name && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-2 block text-sm font-bold"
          >
            Email Address
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={values.email}
            disabled={isLoading}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            aria-invalid={Boolean(errors.email)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[#dce4e1] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#e97c53]"
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-2 block text-sm font-bold"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={values.password}
              disabled={isLoading}
              onChange={(event) =>
                updateField("password", event.target.value)
              }
              aria-invalid={Boolean(errors.password)}
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-[#dce4e1] px-4 py-3.5 pr-12 text-sm outline-none focus:border-[#e97c53]"
            />

            <button
              type="button"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#657584]"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {errors.password && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            className="mb-2 block text-sm font-bold"
          >
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={values.confirmPassword}
              disabled={isLoading}
              onChange={(event) =>
                updateField(
                  "confirmPassword",
                  event.target.value
                )
              }
              aria-invalid={Boolean(errors.confirmPassword)}
              placeholder="Repeat your password"
              className="w-full rounded-xl border border-[#dce4e1] px-4 py-3.5 pr-12 text-sm outline-none focus:border-[#e97c53]"
            />

            <button
              type="button"
              aria-label={
                showConfirm
                  ? "Hide confirmation password"
                  : "Show confirmation password"
              }
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#657584]"
            >
              {showConfirm ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {message && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl bg-[#fff3e9] p-4 text-sm leading-6 text-[#975636]"
          >
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14243a] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#294562] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating Account..." : "Continue"}
          <ArrowRight size={18} />
        </button>

        <p className="text-center text-sm text-[#72808c]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-extrabold text-[#d97750] hover:underline"
          >
            Sign In
          </Link>
        </p>

        <p className="text-center text-xs leading-6 text-[#8a96a0]">
          Your account will be created after secure
          server-side validation.
        </p>
      </form>
    </AuthLayout>
  );
}
