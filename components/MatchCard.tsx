import { HULL_HAWKS_TEAM, isHawksHome, opponentForHawks, resultForHawks } from "@/lib/hockey";
import type { Fixture } from "@/types/hockey";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function MatchCard({
  fixture,
  kind,
}: {
  fixture?: Fixture;
  kind: "next" | "result";
}) {
  if (!fixture) {
    return (
      <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--hawk-lime)]">
          {kind === "next" ? "Next match" : "Latest result"}
        </p>
        <p className="mt-8 text-xl font-bold">No match available</p>
      </article>
    );
  }

  const result = resultForHawks(fixture);
  const hawksHome = isHawksHome(fixture);
  const hawksScore = hawksHome ? fixture.homeScore : fixture.awayScore;
  const opponentScore = hawksHome ? fixture.awayScore : fixture.homeScore;

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 md:p-9">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--hawk-lime)]">
          {kind === "next" ? "Next match" : "Latest result"}
        </p>
        {result && (
          <span className="rounded-full bg-[var(--hawk-lime)] px-3 py-1 text-xs font-black text-[var(--ink)]">
            {result}
          </span>
        )}
      </div>

      <div className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
          {dateFormatter.format(new Date(`${fixture.date}T12:00:00`))}
          {fixture.time ? ` · ${fixture.time}` : ""}
        </p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase leading-none md:text-4xl">
              {HULL_HAWKS_TEAM}
            </h2>
            <p className="mt-3 text-lg text-white/55">
              {hawksHome ? "vs" : "at"} {opponentForHawks(fixture)}
            </p>
          </div>

          {kind === "result" && hawksScore !== undefined && opponentScore !== undefined && (
            <div className="text-right text-5xl font-black tracking-tight">
              {hawksScore}
              <span className="mx-2 text-white/25">–</span>
              {opponentScore}
            </div>
          )}
        </div>

        {fixture.venue && (
          <p className="mt-8 border-t border-white/10 pt-5 text-sm text-white/40">
            {fixture.venue}
          </p>
        )}
      </div>
    </article>
  );
}
