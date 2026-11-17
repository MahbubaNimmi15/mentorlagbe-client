
import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  accent?: "orange" | "green" | "blue" | "purple";
};

const accents = {
  orange: "bg-[#fff0e7] text-[#b76542]",
  green: "bg-[#e3f4e8] text-[#347457]",
  blue: "bg-[#e7f0ff] text-[#4270ac]",
  purple: "bg-[#f1eafb] text-[#7852ad]",
};

export function StatCard({
  title,
  value,
  description,
  icon,
  accent = "green",
}: Props) {
  return (
    <article className="rounded-[22px] border border-[#e6ebe7] bg-white p-6 shadow-[0_8px_25px_rgba(20,36,58,0.03)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#71808c]">
            {title}
          </p>

          <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accents[accent]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-xs leading-6 text-[#86939d]">
        {description}
      </p>
    </article>
  );
}
