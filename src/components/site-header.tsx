
"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowUpRight,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Find a Mentor", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Subjects", href: "/#subjects" },
  { label: "How It Works", href: "/#how-it-works" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#ecede9] bg-white/95 backdrop-blur-xl">
      <div className="site-container flex h-20 items-center justify-between gap-5">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14243a] text-white">
            <GraduationCap
              size={25}
              strokeWidth={2.3}
            />
          </span>

          <span className="text-[22px] font-extrabold tracking-[-1.1px]">
            Mentor
            <span className="text-[#e97c53]">
              Lagbe
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#485669] transition-colors hover:text-[#e97c53]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/tuitions"
          className="btn-primary hidden shrink-0 xl:inline-flex"
        >
          Explore Tuitions
          <ArrowUpRight size={17} />
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={
            menuOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="rounded-xl border border-[#e5e9e7] p-2.5 lg:hidden"
        >
          {menuOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-[#ecede9] bg-white px-5 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#35465a] transition-colors hover:bg-[#fff9f0]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
