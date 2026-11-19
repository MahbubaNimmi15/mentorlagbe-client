
export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading MentorLagbe"
      className="min-h-screen bg-[#fff9f0] px-4 py-12 sm:px-6"
    >
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-10 text-center">
          <div className="mx-auto h-4 w-32 rounded-full bg-[#e9e0d7]" />

          <div className="mx-auto mt-5 h-10 w-full max-w-lg rounded-xl bg-[#e9e0d7]" />

          <div className="mx-auto mt-4 h-4 w-full max-w-md rounded bg-[#eee6dd]" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
            <div className="h-5 w-36 rounded bg-[#e9e0d7]" />

            <div className="mt-7 h-12 w-4/5 rounded-lg bg-[#e9e0d7]" />

            <div className="mt-4 h-12 w-3/5 rounded-lg bg-[#eee6dd]" />

            <div className="mt-8 space-y-3">
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-4 w-2/3 rounded bg-slate-100" />
            </div>

            <div className="mt-9 flex gap-3">
              <div className="h-12 w-36 rounded-xl bg-[#e97c53]/30" />
              <div className="h-12 w-28 rounded-xl bg-slate-100" />
            </div>
          </div>

          <div className="h-80 rounded-3xl bg-[#e3f4e8] lg:h-96" />
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 bg-white p-6"
            >
              <div className="h-12 w-12 rounded-xl bg-[#e3f4e8]" />

              <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />

              <div className="mt-4 h-4 w-full rounded bg-slate-100" />

              <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        <span className="sr-only">
          Loading, please wait.
        </span>
      </div>
    </main>
  );
}
