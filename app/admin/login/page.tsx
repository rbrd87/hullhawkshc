type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--black)] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="eyebrow text-[var(--red)]">Hull Hawks HC</p>
          <h1 className="sports-text mt-3 text-5xl font-bold uppercase tracking-tight">
            Hawks Admin
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/45">
            Private club administration
          </p>
        </div>

        <div className="panel rounded-xl p-6 sm:p-8">
          <form action="/api/admin/login" method="POST">
            <label htmlFor="password" className="meta text-white/50">
              Admin Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="mt-3 min-h-12 w-full rounded-lg border border-white/15 bg-[#161618] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[var(--red)]"
              placeholder="Enter password"
            />
            {hasError && (
              <div className="mt-4 rounded-lg border border-[var(--red)]/30 bg-[var(--red)]/10 px-4 py-3">
                <p className="text-sm text-red-200">
                  That password isn't correct. Give it another go.
                </p>
              </div>
            )}
            <button
              type="submit"
              className="sports-text mt-6 min-h-12 w-full rounded-lg bg-[var(--red)] px-5 py-3 font-semibold uppercase tracking-[.08em] text-white transition hover:bg-[var(--red-dark)]"
            >
              Sign In
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-white/25">
          Hull Hawks Hockey Club
        </p>
      </div>
    </main>
  );
}
