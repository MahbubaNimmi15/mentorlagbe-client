
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Home,
  SearchX,
} from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#fff9f0] px-4 py-16">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[#e3f4e8] sm:h-48 sm:w-48">
          <SearchX
            size={75}
            strokeWidth={1.6}
            className="text-[#14243a]"
          />

          <span className="absolute -right-3 top-4 rounded-2xl bg-white px-4 py-2 text-sm font-extrabold text-[#e97c53] shadow-md">
            404
          </span>
        </div>

        <p className="mt-9 text-sm font-extrabold uppercase tracking-[0.2em] text-[#e97c53]">
          Page Not Found
        </p>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#14243a] sm:text-5xl">
          Looks Like You Took
          <span className="block text-[#e97c53]">
            a Wrong Turn!
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-slate-600">
          The page you are looking for may have moved,
          been removed, or never existed. But there are
          still plenty of learning opportunities to explore.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14243a] px-6 py-3 font-bold text-white transition hover:bg-[#294562]"
          >
            <Home size={18} />
            Back to Homepage
          </Link>

          <Link
            href="/tuitions"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e97c53] px-6 py-3 font-bold text-white transition hover:bg-[#d96b43]"
          >
            <BookOpen size={18} />
            Browse Tuitions
            <ArrowRight size={17} />
          </Link>
        </div>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
        >
          <ArrowLeft size={17} />
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
