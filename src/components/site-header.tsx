
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

const navigation = [
  { label: "Home", href: "/" },
  { label: "Find a Mentor", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ecede9] bg-white/95 backdrop-blur-xl">
      <div className="site-container flex h-20 items-center justify-between gap-5">

        {/* Logo - Left */}
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

        {/* Desktop Navigation - Center */}
        <nav
          className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-8"
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-[13px] font-semibold transition-colors xl:text-sm ${
                  active
                    ? "text-[#e97c53]"
                    : "text-[#485669] hover:text-[#e97c53]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions - Right */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
          <Link
            href="/sign-in"
            className="whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold text-[#14243a] transition hover:bg-[#f7f8f5]"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#14243a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#294562]"
          >
            Join Now
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-xl border border-[#e5e9e7] p-2.5 lg:hidden"
        >
          {menuOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[#ecede9] bg-white px-5 py-4 lg:hidden"
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

            <div className="my-3 border-t border-[#e6eae7]" />

            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-bold"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              onClick={closeMenu}
              className="rounded-xl bg-[#14243a] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Create Account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
