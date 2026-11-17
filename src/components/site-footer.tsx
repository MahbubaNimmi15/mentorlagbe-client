
import Link from "next/link";
import {
  ArrowUpRight,
  GraduationCap,
  Heart,
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#14243a] text-white">
      <div className="site-container grid gap-12 py-16 md:grid-cols-3">
        {/* Brand Section */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff8b63] text-[#14243a]">
              <GraduationCap size={24} />
            </span>

            <span className="text-2xl font-extrabold tracking-tight">
              MentorLagbe
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-[#bdcad5]">
            A thoughtful space where ambitious learners
            discover mentors, build confidence, and grow.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="mb-5 font-bold">
            Explore
          </h3>

          <div className="flex flex-col gap-3 text-sm text-[#bdcad5]">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/tuitions"
              className="transition hover:text-white"
            >
              Find a Mentor
            </Link>

            <Link
              href="/#subjects"
              className="transition hover:text-white"
            >
              Subjects
            </Link>

            <Link
              href="/#how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* Mission */}
        <div>
          <h3 className="mb-5 font-bold">
            Our Mission
          </h3>

          <p className="max-w-xs text-sm leading-7 text-[#bdcad5]">
            Making quality learning opportunities more
            accessible through meaningful mentorship.
          </p>

          <Link
            href="/tuitions"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ffb08f] transition hover:text-white"
          >
            Start Exploring
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col justify-between gap-3 py-6 text-xs text-[#9fb0be] sm:flex-row">
          <p>
            © 2026 MentorLagbe. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5">
            Designed with
            <Heart
              size={13}
              className="text-[#ff8b63]"
            />
            for learners
          </p>
        </div>
      </div>
    </footer>
  );
}
