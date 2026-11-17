
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Find a Mentor", href: "/tuitions" },
  { label: "Subjects", href: "/#subjects" },
  { label: "How It Works", href: "/#how-it-works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ecede9] bg-white/95 backdrop-blur-xl">
      <div className="site-container flex h-20 items-center justify-between gap-5">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14243a] text-white">
            <GraduationCap size={25} strokeWidth={2.3} />
          </span>
          <span className="text-[22px] font-extrabold tracking-[-1.1px]">
            Mentor<span className="text-[#e97c53]">Lagbe</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-[#e97c53] ${
                pathname === link.href
                  ? "text-[#e97c53]"
                  : "text-[#485669]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/tuitions"
          className="btn-primary hidden lg:inline-flex"
        >
          Explore Tuitions
          <ArrowUpRight size={17} />
        </Link>

        <button
          type="button"
          className="rounded-xl border border-[#e5e9e7] p-2.5 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-[#ecede9] bg-white px-5 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#35465a] hover:bg-[#fff9f0]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
