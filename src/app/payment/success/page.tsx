
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Home,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="bg-[#14243a] px-6 py-12 text-center text-white sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f4e8] text-emerald-700">
              <CheckCircle2 size={42} strokeWidth={2} />
            </div>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
              <Sparkles size={14} />
              Payment Return Preview
            </span>

            <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              Payment Return Received
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-200">
              You have reached the payment success return
              page. Your transaction must be verified with
              Stripe before your subscription can be activated.
            </p>
          </div>

          <div className="space-y-6 p-6 sm:p-9">
            <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <ShieldAlert
                size={23}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <div>
                <h2 className="text-sm font-extrabold text-amber-950">
                  Payment Not Yet Verified
                </h2>

                <p className="mt-2 text-sm leading-6 text-amber-900">
                  This is a frontend preview. Opening this
                  URL does not prove a payment was made.
                  No Stripe verification has run, no payment
                  record has been saved, and no Pro Plan
                  has been activated.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#14243a]">
                <CreditCard
                  size={21}
                  className="text-[#e97c53]"
                />
                Subscription Status
              </h2>

              <dl className="mt-5 space-y-4">
                <div className="flex flex-wrap justify-between gap-3 border-b border-slate-200 pb-3">
                  <dt className="text-sm text-slate-500">
                    Payment Verification
                  </dt>

                  <dd className="text-sm font-bold text-amber-700">
                    Not Connected
                  </dd>
                </div>

                <div className="flex flex-wrap justify-between gap-3 border-b border-slate-200 pb-3">
                  <dt className="text-sm text-slate-500">
                    Plan Activation
                  </dt>

                  <dd className="text-sm font-bold text-slate-700">
                    Not Activated
                  </dd>
                </div>

                <div className="flex flex-wrap justify-between gap-3">
                  <dt className="text-sm text-slate-500">
                    Payment Record
                  </dt>

                  <dd className="text-sm font-bold text-slate-700">
                    Not Available
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d96c45]"
              >
                <CreditCard size={18} />
                View Subscription Plans
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#14243a] transition hover:bg-slate-50"
              >
                Go to Dashboard
              </Link>
            </div>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              <Home size={16} />
              Back to Homepage
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-slate-500">
          MentorLagbe · Payment return interface preview
        </p>
      </div>
    </main>
  );
}
