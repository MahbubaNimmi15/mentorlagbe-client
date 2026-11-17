
import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing & Pro Plans",
  description:
    "Explore MentorLagbe Free, Student Pro and Tutor Pro plans.",
};

type Plan = {
  name: string;
  audience: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    audience: "Students & Tutors",
    price: "$0",
    description:
      "Everything you need to begin your learning journey.",
    features: [
      "Browse tuition opportunities",
      "Student tuition applications",
      "Student and Tutor dashboards",
      "Up to 2 tuition posts for Free Tutors",
      "Basic profile management",
    ],
    popular: false,
  },
  {
    name: "Student Pro",
    audience: "For Students",
    price: "$10",
    description:
      "Get priority benefits for your learning journey.",
    features: [
      "Everything in the Free Student plan",
      "Priority booking benefits",
      "Application tracking dashboard",
      "Pro Student plan status",
      "Personal profile management",
    ],
    popular: true,
  },
  {
    name: "Tutor Pro",
    audience: "For Tutors",
    price: "$15",
    description:
      "Grow your tutoring opportunities without limits.",
    features: [
      "Everything in the Free Tutor plan",
      "Unlimited tuition posts",
      "Pro Tutor badge",
      "Applicant management dashboard",
      "Manage active tuition listings",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="bg-[#fff9f0] py-16 md:py-24">
        <div className="site-container text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#ae6246]">
            <Sparkles size={16} />
            SIMPLE & TRANSPARENT PRICING
          </div>

          <h1 className="mx-auto mt-7 max-w-3xl text-5xl font-extrabold tracking-[-3px] md:text-6xl">
            Find the plan that
            <span className="text-[#e97c53]">
              {" "}fits your journey.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#687683]">
            Whether you are learning something new or
            helping others grow, MentorLagbe has a plan
            designed for you.
          </p>
        </div>
      </section>

      <section className="site-container py-16 lg:py-24">
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-[28px] border p-7 md:p-9 ${
                plan.popular
                  ? "border-[#ff8b63] bg-[#fff9f0] shadow-[0_20px_50px_rgba(20,36,58,0.08)]"
                  : "border-[#e4eae6] bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-[#356c52]">
                  {plan.audience}
                </span>

                {plan.popular && (
                  <BadgeCheck
                    size={26}
                    className="text-[#e97c53]"
                  />
                )}
              </div>

              <h2 className="mt-8 text-2xl font-extrabold">
                {plan.name}
              </h2>

              <p className="mt-3 min-h-14 text-sm leading-7 text-[#687683]">
                {plan.description}
              </p>

              <div className="mt-8">
                <p className="text-5xl font-extrabold tracking-tight">
                  {plan.price}
                </p>
                <p className="mt-2 text-xs text-[#81909a]">
                  Pro billing will be configured with Stripe
                </p>
              </div>

              <div className="my-8 border-t border-[#e4eae6]" />

              <h3 className="mb-5 text-sm font-extrabold">
                Plan includes
              </h3>

              <ul className="flex flex-1 flex-col gap-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-6 text-[#536474]"
                  >
                    <Check
                      size={18}
                      className="mt-1 shrink-0 text-[#348265]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#14243a] px-5 py-4 text-sm font-bold text-white opacity-60"
                >
                  {plan.name === "Free"
                    ? "Registration Coming Soon"
                    : "Checkout Coming Soon"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-[#81909a]">
          These plans follow the assignment requirements.
          Authentication and Stripe checkout are not
          connected yet.
        </p>
      </section>

      <section className="bg-[#f5f9f5] py-20">
        <div className="site-container">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[3px] text-[#d97750]">
              WHY MENTORLAGBE
            </p>

            <h2 className="section-title mt-4">
              Built around your growth.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: "Focused Learning",
                description:
                  "Discover tuition opportunities based on your academic goals.",
              },
              {
                icon: Users,
                title: "Student & Tutor Tools",
                description:
                  "Dedicated dashboards designed for each user role.",
              },
              {
                icon: ShieldCheck,
                title: "Admin Moderation",
                description:
                  "Tuition posts will be reviewed before appearing publicly.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-[24px] border border-[#e5ece6] bg-white p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f4e8]">
                  <feature.icon size={25} />
                </div>

                <h3 className="mt-6 text-xl font-extrabold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#687683]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-[#607181]">
            <span className="flex items-center gap-2">
              <CreditCard size={18} />
              Stripe integration planned
            </span>

            <span className="flex items-center gap-2">
              <ShieldCheck size={18} />
              Secure role-based access planned
            </span>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/tuitions"
              className="btn-primary"
            >
              Explore Tuitions
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
