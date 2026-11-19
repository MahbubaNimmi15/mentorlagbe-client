
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

type ToastItem = {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
};

type ToastOptions = {
  title: string;
  description?: string;
};

type ToastContextType = {
  success: (options: ToastOptions) => void;
  error: (options: ToastOptions) => void;
  warning: (options: ToastOptions) => void;
  info: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(
  null
);

const toastStyles = {
  success: {
    border: "border-emerald-200",
    iconBackground: "bg-emerald-50",
    iconColor: "text-emerald-700",
    icon: CheckCircle2,
  },
  error: {
    border: "border-red-200",
    iconBackground: "bg-red-50",
    iconColor: "text-red-600",
    icon: AlertCircle,
  },
  warning: {
    border: "border-amber-200",
    iconBackground: "bg-amber-50",
    iconColor: "text-amber-700",
    icon: AlertTriangle,
  },
  info: {
    border: "border-blue-200",
    iconBackground: "bg-blue-50",
    iconColor: "text-blue-700",
    icon: Info,
  },
};

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const addToast = useCallback(
    (type: ToastType, options: ToastOptions) => {
      const id = ++nextId.current;

      setToasts((current) =>
        [
          ...current,
          {
            id,
            type,
            title: options.title,
            description: options.description,
          },
        ].slice(-4)
      );

      const timer = setTimeout(() => {
        dismiss(id);
      }, 4500);

      timers.current.set(id, timer);
    },
    [dismiss]
  );

  useEffect(() => {
    const activeTimers = timers.current;

    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  const success = useCallback(
    (options: ToastOptions) => addToast("success", options),
    [addToast]
  );

  const error = useCallback(
    (options: ToastOptions) => addToast("error", options),
    [addToast]
  );

  const warning = useCallback(
    (options: ToastOptions) => addToast("warning", options),
    [addToast]
  );

  const info = useCallback(
    (options: ToastOptions) => addToast("info", options),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        success,
        error,
        warning,
        info,
        dismiss,
      }}
    >
      {children}

      <div
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-4 top-24 z-[100] flex flex-col gap-3 sm:inset-x-auto sm:right-6 sm:w-[380px]"
      >
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              role={
                toast.type === "error" ? "alert" : "status"
              }
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${style.border} bg-white p-4 shadow-xl`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBackground}`}
              >
                <Icon
                  size={21}
                  className={style.iconColor}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-[#14243a]">
                  {toast.title}
                </p>

                {toast.description && (
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {toast.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}
