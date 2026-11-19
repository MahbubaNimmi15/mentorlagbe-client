
"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast-provider";

type Action = "accept" | "reject" | "delete";

const actions = {
  accept: {
    title: "Accept Application?",
    description:
      "This will update the sample application status to Accepted.",
    confirmLabel: "Accept Application",
    variant: "info" as const,
  },
  reject: {
    title: "Reject Application?",
    description:
      "This will update the sample application status to Rejected.",
    confirmLabel: "Reject Application",
    variant: "warning" as const,
  },
  delete: {
    title: "Delete Tuition?",
    description:
      "This is a demo confirmation. No database record will be deleted.",
    confirmLabel: "Delete Demo",
    variant: "danger" as const,
  },
};

export default function ConfirmPreviewPage() {
  const toast = useToast();
  const [action, setAction] = useState<Action | null>(null);
  const [status, setStatus] = useState("Pending");

  function confirmAction() {
    if (!action) return;

    if (action === "accept") {
      setStatus("Accepted");
      toast.success({
        title: "Demo Application Accepted",
        description: "Only local preview state was updated.",
      });
    } else if (action === "reject") {
      setStatus("Rejected");
      toast.warning({
        title: "Demo Application Rejected",
        description: "Only local preview state was updated.",
      });
    } else {
      setStatus("Deleted (Demo)");
      toast.info({
        title: "Demo Delete Confirmed",
        description: "No database record was deleted.",
      });
    }

    setAction(null);
  }

  return (
    <main className="min-h-[75vh] bg-[#fff9f0] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-7 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#e97c53]">
          Frontend UI Testing
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-[#14243a]">
          Confirmation Dialog Preview
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          Test Accept, Reject and Delete confirmations.
          All actions are demos and do not connect to MongoDB.
        </p>

        <div className="mt-7 rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-semibold text-slate-500">
            Sample Application Status
          </p>
          <p className="mt-2 text-xl font-bold text-[#14243a]">
            {status}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setAction("accept")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <CheckCircle2 size={18} />
            Accept
          </button>

          <button
            type="button"
            onClick={() => setAction("reject")}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white hover:bg-amber-700"
          >
            <ShieldAlert size={18} />
            Reject
          </button>

          <button
            type="button"
            onClick={() => setAction("delete")}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>

        <Link
          href="/dashboard/tutor"
          className="mt-8 inline-block text-sm font-semibold text-[#e97c53] hover:underline"
        >
          Back to Tutor Dashboard
        </Link>
      </div>

      {action && (
        <ConfirmDialog
          open={true}
          {...actions[action]}
          onCancel={() => setAction(null)}
          onConfirm={confirmAction}
        />
      )}
    </main>
  );
}
