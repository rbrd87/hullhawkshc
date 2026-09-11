import Link from "next/link";

const adminSections = [
  {
    title: "Matchday Graphics",
    description: "Create Next Match and Full Time social graphics.",
    href: "/admin/graphics",
    status: "Available",
  },
  {
    title: "Players",
    description: "Manage the private Hull Hawks squad.",
    href: "#",
    status: "Coming Soon",
  },
  {
    title: "Availability",
    description: "See who's available for upcoming fixtures.",
    href: "#",
    status: "Coming Soon",
  },
  {
    title: "Selection",
    description: "Build and manage the matchday squad.",
    href: "#",
    status: "Coming Soon",
  },
  {
    title: "Matchday Jobs",
    description: "Organise teas, umpiring and other matchday jobs.",
    href: "#",
    status: "Coming Soon",
  },
  {
    title: "Training",
    description: "Record and review training attendance.",
    href: "#",
    status: "Coming Soon",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--black)] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-10 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--red)]">Hull Hawks HC</p>

              <h1 className="sports-text mt-3 text-5xl font-bold uppercase tracking-tight sm:text-6xl">
                Hawks Admin
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
                Club tools, matchday admin and squad management.
              </p>
            </div>

            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="sports-text min-h-11 rounded-lg border border-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-[.07em] text-white/55 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
              >
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="meta text-white/35">Club Tools</p>

              <h2 className="sports-text mt-2 text-3xl font-bold uppercase">
                What are we doing?
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminSections.map((section) => {
              const isAvailable = section.status === "Available";

              const content = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="sports-text text-2xl font-bold uppercase leading-none">
                      {section.title}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.08em] ${
                        isAvailable
                          ? "bg-[var(--red)]/15 text-red-300"
                          : "bg-white/5 text-white/25"
                      }`}
                    >
                      {section.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/40">
                    {section.description}
                  </p>

                  <div className="sports-text mt-8 text-sm font-semibold uppercase tracking-[.08em]">
                    {isAvailable ? (
                      <span className="text-[var(--red)]">Open Tool →</span>
                    ) : (
                      <span className="text-white/20">Coming Soon</span>
                    )}
                  </div>
                </>
              );

              if (!isAvailable) {
                return (
                  <div
                    key={section.title}
                    className="panel rounded-xl p-6 opacity-60"
                  >
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className="panel group rounded-xl p-6 transition hover:-translate-y-0.5 hover:border-[var(--red)]/40"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
