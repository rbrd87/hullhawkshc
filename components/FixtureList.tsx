import type { Fixture } from "@/types/hockey";
import { HULL_HAWKS_TEAM, isHawksHome, opponentForHawks } from "@/lib/hockey";

const formatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

export function FixtureList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="divide-y divide-black/10 border-y border-black/10">
      {fixtures.map((fixture) => (
        <div key={fixture.id} className="grid gap-3 py-5 md:grid-cols-[150px_1fr_auto] md:items-center">
          <div>
            <p className="font-black">{formatter.format(new Date(`${fixture.date}T12:00:00`))}</p>
            <p className="text-sm text-black/45">{fixture.time ?? "TBC"}</p>
          </div>
          <div>
            <p className="text-lg font-black">
              {HULL_HAWKS_TEAM}
              <span className="mx-3 font-normal text-black/25">{isHawksHome(fixture) ? "vs" : "at"}</span>
              {opponentForHawks(fixture)}
            </p>
            {fixture.venue && <p className="mt-1 text-sm text-black/40">{fixture.venue}</p>}
          </div>
          <span className="w-fit rounded-full border border-black/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-black/50">
            {isHawksHome(fixture) ? "Home" : "Away"}
          </span>
        </div>
      ))}
    </div>
  );
}
