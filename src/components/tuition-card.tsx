
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Monitor,
} from "lucide-react";
import {
  formatBDT,
  type Tuition,
} from "@/lib/tuition-data";

type Props = {
  tuition: Tuition;
};

export function TuitionCard({ tuition }: Props) {
  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e7ebe8] bg-white">
      <div
        className="relative flex h-[168px] items-center justify-center overflow-hidden"
        style={{ backgroundColor: tuition.color }}
      >
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border-[24px] border-white/40" />
        <div className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full border-[20px] border-white/40" />

        <span className="relative text-[60px] font-black tracking-[-5px] text-[#14243a]">
          {tuition.symbol}
        </span>

        <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#14243a]">
          {tuition.mode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#e3f4e8] px-3 py-1 text-[11px] font-bold text-[#326752]">
            {tuition.subject}
          </span>
          <span className="rounded-full bg-[#fff0e7] px-3 py-1 text-[11px] font-bold text-[#ae5c3b]">
            {tuition.classLevel}
          </span>
        </div>

        <h3 className="min-h-[56px] text-[19px] font-extrabold leading-7 tracking-tight">
          {tuition.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#72808c]">
          {tuition.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#637382]">
          <span className="flex items-center gap-1.5">
            {tuition.mode === "Online" ? (
              <Monitor size={14} />
            ) : (
              <MapPin size={14} />
            )}
            {tuition.location}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {tuition.daysPerWeek} days/week
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between border-t border-[#edf0ed] pt-4">
            <div>
              <p className="text-xs text-[#7d8a94]">
                Monthly fee
              </p>
              <p className="mt-1 text-[23px] font-extrabold tracking-tight">
                {formatBDT(tuition.monthlyFee)}
              </p>
            </div>

            <span className="rounded-xl bg-[#14243a] p-3 text-white">
              <ArrowUpRight size={20} />
            </span>
          </div>

          <p className="mt-3 text-xs font-medium text-[#7a8791]">
            Tutor: {tuition.tutorName}
          </p>
        </div>
      </div>
    </article>
  );
}
