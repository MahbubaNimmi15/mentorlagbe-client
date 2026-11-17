
import Link from "next/link";
import type { ReactNode } from "react";

import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  badge: string;
};

export function AuthLayout({
  children,
  title,
  description,
  badge,
}: AuthLayoutProps) {
  return (
    <section className="bg-[#fff9f0] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-[1150px] overflow-hidden rounded-[30px] bg-white shadow-[0_25px_80px_rgba(20,36,58,0.08)] lg:min-h-[680px] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#14243a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#ff8b63]/15 blur-2xl" />
          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#e3f4e8]/10 blur-2xl" />

          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff8b63] text-[#14243a]">
                <GraduationCap size={27} />
              </span>
              <span className="text-2xl font-extrabold tracking-tight">
                MentorLagbe
              </span>
            </Link>

            <div className="mt-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-[#ffd4bd]">
                <Sparkles size={15} />
                LEARN BEYOND LIMITS
              </div>

              <h2 className="mt-7 max-w-md text-[44px] font-extrabold leading-[1.15] tracking-[-2px]">
                Your future grows with the
                <span className="text-[#ff8b63]">
                  {" "}right connections.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-8 text-[#bac9d3]">
                Find mentors, share knowledge and explore
                academic opportunities in one thoughtfully
                designed learning space.
              </p>
            </div>

            <div className="relative mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-[22px] bg-white/10 p-5">
                <BookOpen
                  size={26}
                  className="text-[#ffb38d]"
                />
                <p className="mt-4 text-sm font-bold">
                  Explore tuition
                </p>
                <p className="mt-2 text-xs leading-6 text-[#c0ccd5]">
                  Find the right subject and learning mode.
                </p>
              </div>

              <div className="rounded-[22px] bg-white/10 p-5">
                <Users
                  size={26}
                  className="text-[#b5e3c4]"
                />
                <p className="mt-4 text-sm font-bold">
                  Grow together
                </p>
                <p className="mt-2 text-xs leading-6 text-[#c0ccd5]">
                  Connect students with skilled tutors.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-14 flex items-center gap-2 text-xs text-[#aebfca]">
            <ShieldCheck size={17} />
            Built for thoughtful learning experiences
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-[425px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#fff0e7] px-4 py-2 text-xs font-extrabold text-[#b66343]">
              <CheckCircle2 size={15} />
              {badge}
            </div>

            <h1 className="text-3xl font-extrabold tracking-[-1.5px] sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#6b7a88]">
              {description}
            </p>

            <div className="mt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
