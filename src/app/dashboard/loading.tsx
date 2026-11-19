
export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="animate-pulse space-y-7"
    >
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-56 rounded-xl bg-slate-200" />
          <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
        </div>

        <div className="h-11 w-36 rounded-xl bg-[#e97c53]/25" />
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-11 w-11 rounded-xl bg-[#e3f4e8]" />
            </div>

            <div className="mt-6 h-9 w-20 rounded-lg bg-slate-200" />
            <div className="mt-4 h-3 w-32 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Content placeholders */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="h-6 w-44 rounded-lg bg-slate-200" />

          <div className="mt-7 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-b border-slate-100 pb-5 last:border-0"
              >
                <div className="h-12 w-12 shrink-0 rounded-xl bg-[#e3f4e8]" />

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>

                <div className="hidden h-8 w-20 rounded-lg bg-slate-100 sm:block" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="h-6 w-36 rounded-lg bg-slate-200" />

          <div className="mt-7 space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#fff0e7]" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 w-4/5 rounded bg-slate-200" />
                  <div className="h-3 w-3/5 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only">
        Dashboard content is loading.
      </span>
    </div>
  );
}
