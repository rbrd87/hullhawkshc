import { HULL_HAWKS_TEAM, isHawksHome, opponentForHawks, resultForHawks } from "@/lib/hockey";
import type { Fixture } from "@/types/hockey";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function MatchCard({ fixture, kind }: { fixture?: Fixture; kind: "next" | "result" }) {
  if (!fixture) return null;

  const result = resultForHawks(fixture);
  const hawksHome = isHawksHome(fixture);
  const hawksScore = hawksHome ? fixture.homeScore : fixture.awayScore;
  const opponentScore = hawksHome ? fixture.awayScore : fixture.homeScore;

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 md:p-9">
      <div className="absolute right-0 top-0 h-full w-1 bg-[var(--red)]" />
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--red)]">
          {kind === "next" ? "Next match" : "Latest result"}
        </p>
        {result && <span className="rounded-full bg-[var(--red)] px-3 py-1 text-xs font-black">{result}</span>}
      </div>

      <p className="mt-9 text-sm font-bold uppercase tracking-[0.18em] text-white/40">
        {dateFormatter.format(new Date(`${fixture.date}T12:00:00`))}
        {fixture.time ? ` · ${fixture.time}` : ""}
      </p>

      <div className="mt-4 flex items-end justify-between gap-5">
        <div>
          <h2 className="text-3xl font-black uppercase leading-none md:text-4xl">{HULL_HAWKS_TEAM}</h2>
          <p className="mt-3 text-lg text-white/50">
            {hawksHome ? "vs" : "at"} {opponentForHawks(fixture)}
          </p>
        </div>

        {kind === "result" && hawksScore !== undefined && opponentScore !== undefined && (
          <div className="whitespace-nowrap text-5xl font-black">
            {hawksScore}<span className="mx-2 text-white/20">–</span>{opponentScore}
          </div>
        )}
      </div>

      {fixture.venue && <p className="mt-8 border-t border-white/10 pt-5 text-sm text-white/35">{fixture.venue}</p>}
    </article>
  );
}
