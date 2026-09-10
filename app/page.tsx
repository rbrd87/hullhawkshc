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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: "Hull Hawks Hockey Club",
    alternateName: "Hull Hawks HC",
    url: "https://www.hullhawkshc.co.uk",
    logo: "https://www.hullhawkshc.co.uk/images/hull-hawks-logo.png",
    sport: "Field Hockey",
    email: "hullhawkshockey@gmail.com",
    sameAs: ["https://www.instagram.com/hullhawks/"],
  };

  return (
    <main className="hawks-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
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

            <div className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <a
                href="#fixtures"
                className="sports-text flex items-center justify-center whitespace-nowrap rounded-md bg-[var(--red)] px-3 py-4 text-sm font-semibold uppercase tracking-[.06em] shadow-[0_0_38px_rgba(206,62,68,.20)] transition hover:bg-[var(--red-dark)] sm:px-9 sm:text-base sm:tracking-[.09em]"
              >
                View fixtures &nbsp; →
              </a>

              <a
                href="#about"
                className="sports-text flex items-center justify-center whitespace-nowrap rounded-md border-2 border-[var(--red)] bg-transparent px-3 py-4 text-sm font-semibold uppercase tracking-[.06em] transition hover:border-[var(--red-dark)] hover:bg-[var(--red-dark)] sm:px-9 sm:text-base sm:tracking-[.09em]"
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
        <div className="grid gap-8 border-b border-white/10 pb-10 text-center md:grid-cols-[1.1fr_.9fr_1fr] md:items-center md:text-left">
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
              className="sports-text mt-4 flex items-center justify-center gap-4 text-3xl font-semibold md:justify-start"
            >
              <FaInstagram size={42} />
              @hullhawks
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="sports-text text-base font-medium uppercase tracking-[.42em] text-white/70">
              Hockey. Hull. Together.
            </p>
            <div className="mx-auto mt-5 h-[3px] w-14 bg-[var(--red)] md:mx-0 md:ml-auto" />
          </div>
        </div>
      </section>

      <section
        id="fixtures"
        className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-20 xl:px-12"
      >
        <p className="eyebrow text-[var(--red)]">Season 2026/27</p>
        <h2 className="sports-text mt-3 text-6xl font-semibold uppercase tracking-[-.02em] md:text-7xl">
          Fixtures
        </h2>

        <div className="mt-7 md:mt-10">
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
        className="mx-auto max-w-[1600px] px-5 py-12 md:px-8 md:py-24 xl:px-12"
      >
        <p className="eyebrow text-[var(--red)]">Hull Hawks HC</p>
        <h2 className="sports-text mt-3 text-6xl font-semibold uppercase tracking-[-.02em] md:text-7xl">
          More than a club.
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          Hull Hawks Hockey Club is a friendly ladies’ hockey club based in
          Hull, established in 2013.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          We started our journey in the bottom division of the YNE Hockey
          Women’s Leagues and, over the years, have worked our way up to become
          regulars in Peak & Wold Division 1. Our highest level to date came in
          the 2025/26 season, when we competed in Yorkshire Women’s Division 2.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          But Hull Hawks has always been about more than league positions. The
          core of our team has been together since the very beginning, with many
          players proudly pulling on the black Hawks kit throughout our 13-year
          history. That sense of friendship and togetherness is a huge part of
          who we are.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          We’re always looking to welcome new players. Whether you’ve played
          hockey for years, are picking up a stick for the first time, or fancy
          getting back into the game after some time away, you’ll be made to
          feel welcome.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          We train every Tuesday from 7–8pm at the{" "}
          <strong>Allam Sport Centre in Hull.</strong>
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          <strong>New players are always welcome</strong> - come along, meet the
          team and give hockey a go!
        </p>
      </section>

      <section id="contact" className="border-t border-white/10 py-12 md:py-24">
        <div className="mx-auto max-w-[1600px] px-5 md:px-8 xl:px-12">
          <p className="eyebrow text-[var(--red)]">Get in touch</p>

          <h2 className="sports-text mt-3 text-6xl font-semibold uppercase tracking-[-.02em] md:text-7xl">
            CONTACT THE HAWKS
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
            Want to join the team, arrange a fixture, talk sponsorship or just
            have a question? We&apos;d love to hear from you.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="mailto:hullhawkshockey@gmail.com"
              className="sports-text inline-flex items-center justify-center bg-[var(--red)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--red-dark)]"
            >
              Email Us →
            </a>

            <a
              href="https://www.instagram.com/hullhawks/"
              target="_blank"
              rel="noreferrer"
              className="sports-text inline-flex items-center justify-center border-2 border-[var(--red)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--red)]"
            >
              Instagram →
            </a>
          </div>

          <p className="mt-5 text-sm text-white/45">
            hullhawkshockey@gmail.com
          </p>
        </div>
      </section>

      <section
        id="support"
        className="border-t border-white/10 bg-white/[0.02] py-12 md:py-24"
      >
        <div className="mx-auto max-w-[1600px] px-5 md:px-8 xl:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow text-[var(--red)]">Support Hull Hawks</p>

              <h2 className="sports-text mt-3 text-6xl font-semibold uppercase tracking-[-.02em] md:text-7xl">
                BACK THE HAWKS
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                We&apos;re proud to represent women&apos;s hockey in Hull and
                we&apos;re always interested in working with local businesses
                and organisations who would like to support the team.
              </p>

              <a
                href="mailto:hullhawkshockey@gmail.com?subject=Hull%20Hawks%20Sponsorship"
                className="sports-text mt-9 inline-flex items-center justify-center bg-[var(--red)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--red-dark)]"
              >
                Talk To Us About Sponsorship →
              </a>
            </div>

            <div className="border-l border-[var(--red)] pl-8">
              <p className="sports-text text-lg font-semibold uppercase tracking-[0.12em]">
                Interested in sponsoring the team?
              </p>

              <p className="mt-4 leading-7 text-white/55">
                Get in touch to discuss opportunities to support Hull Hawks and
                promote your business alongside the club.
              </p>
            </div>
          </div>
        </div>
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
