import { FixtureList } from "@/components/FixtureList";
import { Header } from "@/components/Header";
import { LeagueTable } from "@/components/LeagueTable";
import { MatchCard } from "@/components/MatchCard";
import { FaInstagram } from "react-icons/fa6";
import { getHawksData, getResults, getUpcomingFixtures } from "@/lib/hockey";

export default async function Home() {
  const data = await getHawksData();
  const upcoming = getUpcomingFixtures(data.fixtures);
  const results = getResults(data.fixtures);

  return (
    <main className="hawks-page">
      <section className="hero">
        <Header />

        <div className="mx-auto flex min-h-[720px] max-w-[1600px] items-center px-5 pb-40 pt-32 md:px-8 xl:px-12">
          <div className="max-w-[760px]">
            <p className="eyebrow text-[var(--red)]">We are</p>

            <h1 className="display-title mt-5">
              Hull
              <br />
              Hawks
            </h1>

            <p className="sports-text mt-7 text-lg font-medium uppercase tracking-[.42em] text-white/82">
              Hockey. Hull. Together.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#fixtures"
                className="sports-text rounded-md bg-[var(--red)] px-9 py-4 text-base font-semibold uppercase tracking-[.09em] shadow-[0_0_38px_rgba(206,62,68,.20)] transition hover:bg-[var(--red-dark)]"
              >
                View fixtures &nbsp; →
              </a>

              <a
                href="#about"
                className="sports-text rounded-md border-2 border-[var(--red)] bg-transparent px-9 py-4 text-base font-semibold uppercase tracking-[.09em] transition hover:border-[var(--red-dark)] hover:bg-[var(--red-dark)]"
              >
                About our club
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-32 grid max-w-[1600px] gap-4 px-5 md:grid-cols-2 md:px-8 xl:grid-cols-3 xl:px-12">
        <MatchCard fixture={upcoming[0]} kind="next" />
        <MatchCard fixture={results[0]} kind="result" />

        <article className="panel rounded-xl p-6 md:col-span-2 xl:col-span-1">
          <div className="flex min-h-[40px] items-start justify-between gap-4">
            <p className="section-title">League table</p>
            <p className="max-w-[145px] text-right text-[10px] font-medium uppercase tracking-[.12em] text-white/42">
              YNE Peak &amp; Wold
              <br />
              Women&apos;s Division 1
            </p>
          </div>

          <div className="mt-3">
            <LeagueTable rows={data.table.slice(0, 5)} compact />
          </div>

          <div className="mt-5 border-t border-white/10 pt-4 text-right">
            <a
              href="#table"
              className="sports-text text-[14px] font-semibold uppercase tracking-[.14em] text-[var(--red)] hover:text-white"
            >
              View full table &nbsp; →
            </a>
          </div>
        </article>
      </section>

      <section
        id="sponsors"
        className="mx-auto max-w-[1600px] px-5 py-9 md:px-8 xl:px-12"
      >
        <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-[1.1fr_.9fr_1fr] md:items-center">
          <div>
            <p className="eyebrow text-[11px] text-white/42">Our sponsor</p>

            <a
              href="http://hesslewoodofficepark.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center"
            >
              <img
                src="/images/hesslewood-logo.png"
                alt="Hesslewood Office Park"
                className="h-20 w-auto max-w-[430px] object-contain"
              />
            </a>
          </div>

          <div className="border-white/12 md:border-x md:px-10">
            <p className="eyebrow text-[11px] text-white/42">Follow us</p>

            <a
              href="https://www.instagram.com/hullhawks/"
              target="_blank"
              rel="noreferrer"
              className="sports-text mt-4 flex items-center gap-4 text-3xl font-semibold"
            >
              <FaInstagram size={42} />
              @hullhawks
            </a>
          </div>

          <div className="md:text-right">
            <p className="sports-text text-base font-medium uppercase tracking-[.42em] text-white/70">
              Hockey. Hull. Together.
            </p>
            <div className="mt-5 h-[3px] w-14 bg-[var(--red)] md:ml-auto" />
          </div>
        </div>
      </section>

      <section
        id="fixtures"
        className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 xl:px-12"
      >
        <p className="eyebrow text-[var(--red)]">Season 2026/27</p>
        <h2 className="sports-text mt-3 text-6xl font-semibold uppercase tracking-[-.02em] md:text-7xl">
          Fixtures
        </h2>

        <div className="mt-10">
          <FixtureList fixtures={upcoming} />
        </div>
      </section>

      <section id="table" className="border-y border-white/10 bg-white/[.025]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 xl:px-12">
          <p className="eyebrow text-[var(--red)]">Season 2026/27</p>
          <h2 className="sports-text mt-3 text-6xl font-semibold uppercase tracking-[-.02em] md:text-7xl">
            League table
          </h2>

          <div className="mt-10">
            <LeagueTable rows={data.table} />
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 xl:px-12"
      >
        <p className="eyebrow text-[var(--red)]">Hull Hawks HC</p>
        <h2 className="sports-text mt-3 text-6xl font-semibold uppercase tracking-[-.02em] md:text-7xl">
          More than a club.
        </h2>

        <p className="mt-6 max-w-3xl text-xl leading-9 text-white/52">
          This section is ready for the real Hull Hawks story, training details,
          team information and anything else you want future players and
          supporters to know.
        </p>
      </section>

      <footer id="contact" className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-8 text-base text-white/35 md:flex-row md:justify-between md:px-8 xl:px-12">
          <p>Hull Hawks Hockey Club</p>
          <p>YNE Peak &amp; Wold Women&apos;s Division 1</p>
        </div>
      </footer>
    </main>
  );
}
