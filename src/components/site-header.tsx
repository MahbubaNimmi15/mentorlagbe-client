
"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowUpRight,
  GraduationCap,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Find a Mentor", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "How It Works", href: "/#how-it-works" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ecede9] bg-white/95 backdrop-blur-xl">
      <div className="site-container flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14243a] text-white">
            <GraduationCap size={23} />
          </span>

          <span className="text-[21px] font-extrabold tracking-[-1px]">
            Mentor
            <span className="text-[#e97c53]">
              Lagbe
            </span>
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-5 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[13px] font-semibold text-[#485669] transition hover:text-[#e97c53]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/sign-in"
            className="whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold hover:bg-[#f7f8f5]"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#14243a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#294562]"
          >
            Join Now
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          className="rounded-xl border border-[#e5e9e7] p-2.5 lg:hidden"
        >
          {menuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#ecede9] bg-white p-4 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#fff9f0]"
            >
              {item.label}
            </Link>
          ))}

          <div className="my-3 border-t border-[#e6eae7]" />

          <Link
            href="/sign-in"
            onClick={closeMenu}
            className="block rounded-xl px-4 py-3 text-sm font-semibold"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            onClick={closeMenu}
            className="mt-2 block rounded-xl bg-[#14243a] px-4 py-3 text-center text-sm font-bold text-white"
          >
            Join Now
          </Link>
        </nav>
      )}
    </header>
  );
}
