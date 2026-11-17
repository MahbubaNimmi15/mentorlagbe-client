
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

    // Authentication will be connected to Better Auth later.
    setMessage(
      "Form validation passed. Real sign-in will be enabled after Better Auth and database integration."
    );
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14243a] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#294562]"
        >
          Sign In
          <ArrowRight size={18} />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-[#83909a]">
          <LockKeyhole size={15} />
          Secure login integration coming soon
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
