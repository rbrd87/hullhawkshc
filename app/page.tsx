import { FixtureList } from "@/components/FixtureList";
import { Header } from "@/components/Header";
import { LeagueTable } from "@/components/LeagueTable";
import { MatchCard } from "@/components/MatchCard";
import { getHawksData, getResults, getUpcomingFixtures } from "@/lib/hockey";

export default async function Home() {
  const data = await getHawksData();
  const upcoming = getUpcomingFixtures(data.fixtures);
  const results = getResults(data.fixtures);

  return (
    <main>
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_75%_25%,#315c42_0%,transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--hawk-lime)]">
            Hull · Women&apos;s Hockey
          </p>
          <h1 className="mt-5 max-w-5xl text-6xl font-black uppercase leading-[0.86] tracking-[-0.055em] sm:text-7xl md:text-9xl">
            We are
            <br />
            Hull Hawks.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-white/55">
            Fixtures, results and league standings for Hull Hawks 1 in the
            YNE Peak &amp; Wold Women&apos;s Division 1.
          </p>

          {data.source === "demo" && (
            <div className="mt-10 inline-flex rounded-full border border-amber-200/20 bg-amber-200/10 px-4 py-2 text-sm text-amber-100">
              Demo data · England Hockey connection is the next step
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-24 md:grid-cols-2 md:px-8">
        <MatchCard fixture={upcoming[0]} kind="next" />
        <MatchCard fixture={results[0]} kind="result" />
      </section>

      <section id="fixtures" className="bg-[var(--cream)] text-[var(--ink)]">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--hawk-green)]">
            Coming up
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl">
            Fixtures
          </h2>
          <div className="mt-10 [&_*]:border-black/10 [&_p]:text-black/55">
            <FixtureList fixtures={upcoming} />
          </div>
        </div>
      </section>

      <section id="table" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--hawk-lime)]">
          2026/27
        </p>
        <h2 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl">
          League table
        </h2>
        <div className="mt-10">
          <LeagueTable rows={data.table} />
        </div>
      </section>

      <footer id="about" className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-10 text-sm text-white/35 md:flex-row md:items-center md:justify-between md:px-8">
          <p>Hull Hawks Hockey Club</p>
          <p>YNE Peak &amp; Wold Women&apos;s Division 1 · 2026/27</p>
        </div>
      </footer>
    </main>
  );
}
