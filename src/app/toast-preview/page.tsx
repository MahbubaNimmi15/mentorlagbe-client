
"use client";

import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Info,
} from "lucide-react";

import { useToast } from "@/components/ui/toast-provider";

export default function ToastPreviewPage() {
  const toast = useToast();

  return (
    <main className="min-h-[75vh] bg-[#fff9f0] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-7 shadow-sm sm:p-10">
        <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-emerald-800">
          UI TESTING
        </span>

        <h1 className="mt-6 text-3xl font-extrabold text-[#14243a]">
          MentorLagbe Toast Notifications
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          Click each button to test notification
          appearance, message, close button,
          and automatic dismissal.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              toast.success({
                title: "Profile Updated!",
                description:
                  "Demo success notification. No data was saved.",
              })
            }
            className="flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <CheckCircle2 size={20} />
            Success Toast
          </button>

          <button
            type="button"
            onClick={() =>
              toast.error({
                title: "Something Went Wrong",
                description:
                  "Demo error notification. Please try again.",
              })
            }
            className="flex items-center justify-center gap-3 rounded-xl bg-red-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <AlertCircle size={20} />
            Error Toast
          </button>

          <button
            type="button"
            onClick={() =>
              toast.warning({
                title: "Missing Information",
                description:
                  "Please complete all required fields.",
              })
            }
            className="flex items-center justify-center gap-3 rounded-xl bg-amber-500 px-5 py-4 text-sm font-bold text-[#14243a] transition hover:bg-amber-600"
          >
            <AlertTriangle size={20} />
            Warning Toast
          </button>

          <button
            type="button"
            onClick={() =>
              toast.info({
                title: "Feature Coming Soon",
                description:
                  "Backend integration will be added later.",
              })
            }
            className="flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <Info size={20} />
            Information Toast
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-sm font-bold text-[#14243a]">
            Frontend Preview Only
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            These buttons only display sample messages.
            They do not save profiles, post tuitions,
            change application status, or update the database.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#e97c53] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
