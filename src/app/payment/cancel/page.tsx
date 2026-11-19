
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Home,
  Info,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="bg-[#14243a] px-6 py-12 text-center text-white sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0e7] text-[#e97c53]">
              <XCircle size={42} strokeWidth={2} />
            </div>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
              <Info size={14} />
              Checkout Return Preview
            </span>

            <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              Checkout Was Not Completed
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-200">
              You have returned from the checkout process
              without a confirmed subscription payment.
              You can explore the plans again whenever
              you are ready.
            </p>
          </div>

          <div className="space-y-6 p-6 sm:p-9">
            <div className="flex items-start gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <Info
                size={23}
                className="mt-0.5 shrink-0 text-[#bd5a32]"
              />

              <div>
                <h2 className="text-sm font-extrabold text-[#14243a]">
                  No Subscription Change
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This page is a frontend preview.
                  A Stripe Checkout session has not
                  been verified. Visiting this page
                  does not change your account plan.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#14243a]">
                <ShieldCheck
                  size={21}
                  className="text-[#e97c53]"
                />
                What Happens Next?
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3f4e8] text-xs font-extrabold text-emerald-800">
                    1
                  </span>

                  <div>
                    <p className="text-sm font-bold text-[#14243a]">
                      Review Your Plan
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Compare Student Pro and Tutor Pro
                      benefits on the Pricing page.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3f4e8] text-xs font-extrabold text-emerald-800">
                    2
                  </span>

                  <div>
                    <p className="text-sm font-bold text-[#14243a]">
                      Return to Your Dashboard
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Continue exploring MentorLagbe
                      without completing a subscription.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3f4e8] text-xs font-extrabold text-emerald-800">
                    3
                  </span>

                  <div>
                    <p className="text-sm font-bold text-[#14243a]">
                      Try Again Later
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Payment will be available after
                      Stripe integration is completed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#e97c53] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d96c45]"
              >
                <CreditCard size={18} />
                Explore Pro Plans
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#14243a] hover:bg-slate-50"
              >
                <ArrowLeft size={17} />
                Back to Dashboard
              </Link>
            </div>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              <Home size={16} />
              Go to Homepage
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-slate-500">
          MentorLagbe · Checkout cancellation interface preview
        </p>
      </div>
    </main>
  );
}
