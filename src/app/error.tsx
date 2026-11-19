
"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCcw,
} from "lucide-react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("MentorLagbe route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#fff9f0] px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0e7] text-[#e97c53]">
          <AlertTriangle size={40} />
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-[#e97c53]">
          Something Went Wrong
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#14243a] sm:text-4xl">
          We Hit a Small Bump
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-slate-600">
          MentorLagbe could not load this page properly.
          Please try again. If the problem continues,
          you can return to the homepage.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e97c53] px-6 py-3 font-bold text-white transition hover:bg-[#d96b43]"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-[#14243a] transition hover:bg-slate-50"
          >
            <Home size={18} />
            Go Home
          </Link>
        </div>

        <Link
          href="/dashboard"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <p className="mt-9 text-xs text-slate-400">
          Your learning journey matters to us.
        </p>
      </div>
    </main>
  );
}
