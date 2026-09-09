import { BrandMark } from "@/components/BrandMark";
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

      <section className="hawks-bg relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 md:grid-cols-[1fr_360px] md:px-8 md:py-36">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--red)]">
              Hull · Women&apos;s Hockey
            </p>
            <h1 className="mt-5 text-6xl font-black uppercase leading-[0.84] tracking-[-0.055em] sm:text-7xl md:text-9xl">
              We are<br />Hull Hawks.
            </h1>
            <div className="mt-8 h-1 w-28 bg-[var(--red)]" />
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/55">
              Fixtures, results and league standings for Hull Hawks 1 in the YNE Peak &amp; Wold Women&apos;s Division 1.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#fixtures" className="rounded-full bg-[var(--red)] px-6 py-3 text-sm font-black uppercase tracking-wider hover:bg-white hover:text-black">
                View fixtures
              </a>
              <a href="https://www.instagram.com/hullhawks/" target="_blank" rel="noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-wider hover:border-white">
                Follow the Hawks
              </a>
            </div>
          </div>

          <div className="mx-auto">
            <BrandMark />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-24 md:grid-cols-2 md:px-8">
        <MatchCard fixture={upcoming[0]} kind="next" />
        <MatchCard fixture={results[0]} kind="result" />
      </section>

      <section id="fixtures" className="bg-[var(--white)] text-black">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--red)]">Coming up</p>
          <h2 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl">Fixtures</h2>
          <div className="mt-10">
            <FixtureList fixtures={upcoming} />
          </div>
        </div>
      </section>

      <section id="table" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--red)]">2026/27</p>
        <h2 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl">League table</h2>
        <div className="mt-10">
          <LeagueTable rows={data.table} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--red)]">Proudly sponsored by</p>
            <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">Hesslewood Office Park</h2>
          </div>
          <div className="md:text-right">
            <a
              href="http://hesslewoodofficepark.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full border border-white/15 px-6 py-3 text-sm font-black uppercase tracking-wider hover:border-[var(--red)] hover:bg-[var(--red)]"
            >
              Visit sponsor
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm text-white/35 md:flex-row md:items-center md:justify-between md:px-8">
        <p>Hull Hawks Hockey Club</p>
        <div className="flex gap-5">
          <a href="https://www.instagram.com/hullhawks/" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
          <span>YNE Peak &amp; Wold Women&apos;s Division 1</span>
        </div>
      </footer>
    </main>
  );
}
