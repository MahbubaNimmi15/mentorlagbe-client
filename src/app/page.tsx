
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { TuitionCard } from "@/components/tuition-card";
import { tuitions } from "@/lib/tuition-data";

const categories = [
  { name: "Mathematics", icon: "∑", color: "#E3F4E8" },
  { name: "Physics", icon: "⚛", color: "#E8E9FF" },
  { name: "Programming", icon: "</>", color: "#FFF0DF" },
  { name: "English", icon: "Aa", color: "#FCE7EA" },
];

const howItWorks = [
  {
    number: "01",
    title: "Explore opportunities",
    description:
      "Search tuition listings by subject, class level and learning mode.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose your fit",
    description:
      "Compare schedules, monthly fees and tutor profiles.",
    icon: Users,
  },
  {
    number: "03",
    title: "Apply and grow",
    description:
      "Submit an application and start learning once accepted.",
    icon: GraduationCap,
  },
];

export default function HomePage() {
  const featured = tuitions.slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden bg-[#fff9f0]">
        <div className="site-container grid min-h-[620px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f2d9c9] bg-white px-4 py-2 text-xs font-bold text-[#96543d]">
              <Sparkles size={15} />
              Your next chapter begins here
            </div>

            <h1 className="display-heading max-w-[680px]">
              Great minds
              <br />
              grow with
              <br />
              <span className="text-[#e97c53]">
                great mentors.
              </span>
            </h1>

            <p className="mt-7 max-w-[530px] text-[17px] leading-8 text-[#687683]">
              Discover thoughtful tuition and mentorship
              opportunities designed around your goals,
              schedule and learning style.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/tuitions"
                className="btn-primary"
              >
                Find Your Mentor
                <ArrowUpRight size={19} />
              </Link>

              <Link
                href="/#how-it-works"
                className="btn-secondary"
              >
                How It Works
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 text-xs font-semibold text-[#65747c]">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#348265]" />
                Online & offline
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#348265]" />
                Flexible schedules
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#348265]" />
                Subject-focused learning
              </span>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center py-10">
            <div className="hero-pattern absolute inset-0 rounded-[50px]" />

            <div className="relative w-[85%] rotate-[-5deg] rounded-[34px] bg-[#14243a] p-7 text-white shadow-[0_30px_70px_rgba(20,36,58,.18)] sm:p-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                  Learning space
                </span>
                <Sparkles size={25} className="text-[#ffb58d]" />
              </div>

              <div className="mt-12 flex h-[180px] items-center justify-center rounded-[28px] bg-[#e3f4e8] sm:h-[230px]">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#ff8b63] text-[#14243a] sm:h-40 sm:w-40">
                  <GraduationCap size={84} strokeWidth={1.5} />
                  <div className="absolute -right-5 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
                    <Lightbulb size={26} />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[3px] text-[#9fc4bb]">
                  Your potential
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                  Learning made personal.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#aebfcb]">
                  Find a learning experience that feels
                  right for you.
                </p>
              </div>

              <div className="mt-7 flex items-center gap-3">
                {[BookOpen, Video, ShieldCheck].map(
                  (Icon, index) => (
                    <span
                      key={index}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"
                    >
                      <Icon size={20} />
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="absolute right-0 top-6 rotate-[7deg] rounded-2xl bg-white px-5 py-4 shadow-xl">
              <span className="flex items-center gap-2 text-sm font-extrabold">
                <Sparkles size={18} className="text-[#e97c53]" />
                Keep growing!
              </span>
            </div>

            <div className="absolute bottom-1 left-0 rotate-[5deg] rounded-2xl bg-[#ff8b63] px-5 py-4 text-sm font-extrabold shadow-xl">
              Learn your way
            </div>
          </div>
        </div>
      </section>

      <section
        id="subjects"
        className="site-container scroll-mt-24 py-20 lg:py-24"
      >
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[3px] text-[#d97750]">
              Discover your interest
            </p>
            <h2 className="section-title">
              What sparks your curiosity?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#6c7b88]">
              Every big achievement begins with a
              subject you love exploring.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 text-sm font-extrabold"
          >
            Explore all subjects
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/tuitions?subject=${encodeURIComponent(category.name)}`}
              className="card-hover group relative min-h-[210px] rounded-[25px] p-7"
              style={{ backgroundColor: category.color }}
            >
              <div className="text-5xl font-black tracking-tight">
                {category.icon}
              </div>

              <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between">
                <h3 className="text-lg font-extrabold">
                  {category.name}
                </h3>
                <ArrowUpRight
                  size={21}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f7faf7] py-20 lg:py-24">
        <div className="site-container">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[3px] text-[#d97750]">
                Explore tuitions
              </p>
              <h2 className="section-title">
                Find your next learning opportunity.
              </h2>
              <p className="mt-4 text-sm text-[#6c7b88]">
                Preview tuition opportunities from our
                demonstration catalog.
              </p>
            </div>

            <Link
              href="/tuitions"
              className="inline-flex items-center gap-2 text-sm font-extrabold"
            >
              Browse all tuitions
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((tuition) => (
              <TuitionCard
                key={tuition.id}
                tuition={tuition}
              />
            ))}
          </div>

          <p className="mt-5 text-xs text-[#81909a]">
            Demo listings — tutor profiles and booking
            are not yet connected to MongoDB.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="site-container scroll-mt-24 py-20 lg:py-24"
      >
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[3px] text-[#d97750]">
            A simple journey
          </p>
          <h2 className="section-title">
            Three steps. Endless possibilities.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#6c7b88]">
            A simple path from finding the right opportunity
            to starting your learning journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {howItWorks.map((step) => (
            <article
              key={step.number}
              className="rounded-[25px] border border-[#e7ebe8] p-8"
            >
              <div className="flex items-start justify-between">
                <span className="text-5xl font-black text-[#e9eae5]">
                  {step.number}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f4e8]">
                  <step.icon size={25} />
                </div>
              </div>

              <h3 className="mt-10 text-xl font-extrabold">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#72808c]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-container pb-20 lg:pb-24">
        <div className="relative overflow-hidden rounded-[32px] bg-[#14243a] px-7 py-16 text-center text-white md:px-14">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#ff8b63]/20 blur-2xl" />
          <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-[#e3f4e8]/10 blur-2xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-[#ffd6bd]">
              <Sparkles size={15} />
              Take the next step
            </span>

            <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
              The future you want starts with what you
              learn today.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#bdcad5]">
              Explore a better way to discover tutors,
              subjects and mentorship opportunities.
            </p>

            <Link
              href="/tuitions"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#ff8b63] px-6 py-4 text-sm font-extrabold text-[#14243a] transition hover:bg-[#ffaf8c]"
            >
              Discover Tuitions
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
