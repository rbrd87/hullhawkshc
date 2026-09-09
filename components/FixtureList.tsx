import { HULL_HAWKS_TEAM, isHawksHome, opponentForHawks } from "@/lib/hockey";
import type { Fixture } from "@/types/hockey";

const fmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function FixtureList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {fixtures.map((fixture) => (
        <div
          key={fixture.id}
          className="grid gap-4 py-5 md:grid-cols-[150px_1fr_auto] md:items-center"
        >
          <div>
            <p className="sports-text text-lg font-semibold uppercase">
              {fmt.format(new Date(`${fixture.date}T12:00:00`))}
            </p>
            <p className="mt-1 text-sm text-white/40">
              {fixture.time ?? "TBC"}
            </p>
          </div>

          <div>
            <p className="sports-text text-xl font-semibold uppercase">
              {HULL_HAWKS_TEAM}
              <span className="mx-3 font-normal text-white/25">
                {isHawksHome(fixture) ? "vs" : "at"}
              </span>
              {opponentForHawks(fixture)}
            </p>

            {fixture.venue && (
              <p className="mt-1 text-sm text-white/40">{fixture.venue}</p>
            )}
          </div>

          <span className="sports-text w-fit rounded border border-white/15 px-3 py-2 text-[11px] font-medium uppercase tracking-[.14em] text-white/50">
            {isHawksHome(fixture) ? "Home" : "Away"}
          </span>
        </div>
      ))}
    </div>
  );
}
