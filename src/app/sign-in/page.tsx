
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
  LockKeyhole,
} from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
};

type LoginResponse = {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isLoading) return;

    setError("");
    setMessage("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
          cache: "no-store",
        }
      );

      const data: LoginResponse = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.token ||
        !data.user
      ) {
        setError(
          data.message || "Unable to sign in. Please try again."
        );
        return;
      }

      // Temporary local-development session.
      // A secure HttpOnly cookie session will be added later.
      sessionStorage.setItem(
        "mentorlagbe_auth",
        JSON.stringify({
          token: data.token,
          user: data.user,
        })
      );

      setPassword("");
      setMessage("Login successful. Redirecting...");

      const destination =
        data.user.role === "admin"
          ? "/dashboard/admin"
          : data.user.role === "tutor"
            ? "/dashboard/tutor"
            : "/dashboard/student";

      router.push(destination);
      router.refresh();
    } catch {
      setError(
        "Cannot connect to the server. Check that the MentorLagbe backend is running on port 5001."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      badge="WELCOME BACK"
      title="Sign in to MentorLagbe."
      description="Access your learning journey through one simple account."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="signin-email"
            className="mb-2 block text-sm font-bold"
          >
            Email Address
          </label>

          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="you@example.com"
            disabled={isLoading}
            className="w-full rounded-xl border border-[#dce4e1] px-4 py-3.5 text-sm outline-none focus:border-[#e97c53]"
          />
        </div>

        <div>
          <label
            htmlFor="signin-password"
            className="mb-2 block text-sm font-bold"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
                setMessage("");
              }}
              placeholder="Enter your password"
              disabled={isLoading}
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
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} />
            {error}
          </div>
        )}

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
          {isLoading ? "Signing In..." : "Sign In"}
          <ArrowRight size={18} />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-[#83909a]">
          <LockKeyhole size={15} />
          Secure password verification
        </div>

        <p className="text-center text-sm text-[#72808c]">
          New to MentorLagbe?{" "}
          <Link
            href="/sign-up"
            className="font-extrabold text-[#d97750] hover:underline"
          >
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
