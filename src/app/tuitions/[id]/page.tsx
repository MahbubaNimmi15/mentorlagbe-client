
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Monitor,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  formatBDT,
  tuitions,
} from "@/lib/tuition-data";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return tuitions.map((tuition) => ({
    id: tuition.id,
  }));
}

export default async function TuitionDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const tuition = tuitions.find(
    (item) => item.id === id
  );

  if (!tuition) {
    notFound();
  }

  return (
    <>
      <section className="bg-[#fff9f0] py-12 md:py-16">
        <div className="site-container">
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#526275] hover:text-[#d97750]"
          >
            <ArrowLeft size={17} />
            Back to all tuitions
          </Link>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-[#e3f4e8] px-4 py-2 text-xs font-bold text-[#326752]">
              {tuition.subject}
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#526275]">
              {tuition.classLevel}
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#526275]">
              {tuition.mode}
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-[-2px] md:text-6xl">
            {tuition.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#687683]">
            {tuition.description}
          </p>
        </div>
      </section>

      <section className="site-container grid gap-9 py-12 lg:grid-cols-[1fr_360px] lg:py-16">
        <div className="space-y-8">
          <div
            className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-[30px] md:h-[360px]"
            style={{ backgroundColor: tuition.color }}
          >
            <div className="absolute -left-12 -top-20 h-60 w-60 rounded-full border-[35px] border-white/40" />

            <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full border-[35px] border-white/40" />

            <span className="relative text-[90px] font-black tracking-[-7px] text-[#14243a] md:text-[120px]">
              {tuition.symbol}
            </span>
          </div>

          <div className="rounded-[25px] border border-[#e7ebe8] p-7 md:p-9">
            <div className="flex items-center gap-3">
              <BookOpen size={23} className="text-[#d97750]" />
              <h2 className="text-2xl font-extrabold">
                About this tuition
              </h2>
            </div>

            <p className="mt-6 text-base leading-8 text-[#627181]">
              {tuition.description}
            </p>

            <p className="mt-4 text-sm leading-7 text-[#627181]">
              This sample listing demonstrates how students
              will review tuition information before
              applying. Full schedules, tutor verification
              and enrollment will be available after the
              backend integration.
            </p>
          </div>

          <div className="rounded-[25px] border border-[#e7ebe8] p-7 md:p-9">
            <h2 className="text-2xl font-extrabold">
              Learning details
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <InfoItem
                icon={<GraduationCap size={19} />}
                title="Class level"
                value={tuition.classLevel}
              />

              <InfoItem
                icon={<BookOpen size={19} />}
                title="Subject"
                value={tuition.subject}
              />

              <InfoItem
                icon={<CalendarDays size={19} />}
                title="Weekly sessions"
                value={`${tuition.daysPerWeek} days per week`}
              />

              <InfoItem
                icon={
                  tuition.mode === "Online" ? (
                    <Monitor size={19} />
                  ) : (
                    <MapPin size={19} />
                  )
                }
                title="Learning mode"
                value={tuition.mode}
              />

              <InfoItem
                icon={<MapPin size={19} />}
                title="Location"
                value={tuition.location}
              />

              <InfoItem
                icon={<Clock3 size={19} />}
                title="Class schedule"
                value="To be confirmed"
              />
            </div>
          </div>

          <div className="rounded-[25px] bg-[#e3f4e8] p-7 md:p-9">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} />
              <h2 className="text-xl font-extrabold">
                Application information
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#526c62]">
              In the completed platform, students will
              submit their phone number, preferred schedule
              and learning note here. Applications will
              be reviewed by the tutor.
            </p>
          </div>
        </div>

        <aside className="h-fit rounded-[25px] border border-[#e7ebe8] bg-white p-7 shadow-[0_18px_45px_rgba(20,36,58,.06)] lg:sticky lg:top-28">
          <p className="text-sm text-[#718190]">
            Monthly tuition fee
          </p>

          <p className="mt-2 text-4xl font-extrabold tracking-tight">
            {formatBDT(tuition.monthlyFee)}
          </p>

          <p className="mt-2 text-xs text-[#718190]">
            Per month • Demo listing
          </p>

          <div className="mt-7 border-t border-[#edf0ed] pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e7] text-[#b86042]">
                <UserRound size={24} />
              </div>

              <div>
                <p className="text-xs text-[#718190]">
                  Tutor
                </p>
                <p className="font-bold">
                  {tuition.tutorName}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-[#627181]">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-[#348265]"
                />
                {tuition.daysPerWeek} sessions per week
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-[#348265]"
                />
                {tuition.mode} learning
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled
            title="Student application will be enabled after authentication integration"
            className="mt-8 w-full cursor-not-allowed rounded-xl bg-[#14243a] px-5 py-4 text-sm font-bold text-white opacity-60"
          >
            Apply Now — Coming Soon
          </button>

          <p className="mt-4 text-center text-xs leading-6 text-[#81909a]">
            Student applications will open after
            authentication and database integration.
          </p>
        </aside>
      </section>
    </>
  );
}

function InfoItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#f7faf7] p-4">
      <span className="text-[#527b67]">
        {icon}
      </span>

      <div>
        <p className="text-xs font-semibold text-[#7a8893]">
          {title}
        </p>
        <p className="mt-1 text-sm font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}
