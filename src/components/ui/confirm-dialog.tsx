
"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

type ConfirmVariant = "danger" | "warning" | "info";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  children?: ReactNode;
};

const styles = {
  danger: {
    icon: AlertTriangle,
    iconBackground: "bg-red-50",
    iconColor: "text-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconBackground: "bg-amber-50",
    iconColor: "text-amber-700",
    button: "bg-amber-600 hover:bg-amber-700",
  },
  info: {
    icon: CheckCircle2,
    iconBackground: "bg-[#e3f4e8]",
    iconColor: "text-emerald-700",
    button: "bg-[#14243a] hover:bg-[#294562]",
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
  loading = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const style = styles[variant];
  const Icon = style.icon;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      confirmButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }

        onCancel();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !loading) {
          onCancel();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-slate-100 bg-white p-0 text-[#14243a] shadow-2xl backdrop:bg-[#14243a]/60"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.iconBackground}`}
          >
            <Icon size={28} className={style.iconColor} />
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        <h2
          id={titleId}
          className="mt-6 text-2xl font-extrabold text-[#14243a]"
        >
          {title}
        </h2>

        <p
          id={descriptionId}
          className="mt-3 text-sm leading-7 text-slate-600"
        >
          {description}
        </p>

        {children && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            {children}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            disabled={loading}
            onClick={() => {
              if (!loading) {
                void onConfirm();
              }
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${style.button}`}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
          <Info size={14} />
          Review the action before continuing.
        </div>
      </div>
    </dialog>
  );
}
