export default function SiteUnavailable() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16 text-slate-900">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-xl shadow-slate-300/20 sm:px-12 sm:py-16">
        <div
          className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-slate-400 via-slate-600 to-slate-400"
          aria-hidden="true"
        ></div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Site Notice
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          This website is no longer available
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
          The content previously available at this address has been removed.
        </p>
      </div>
    </main>
  )
}
