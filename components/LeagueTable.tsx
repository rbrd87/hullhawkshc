import { HULL_HAWKS_TEAM } from "@/lib/hockey";
import type { LeagueRow } from "@/types/hockey";

export function LeagueTable({
  rows,
  compact = false,
}: {
  rows: LeagueRow[];
  compact?: boolean;
}) {
  const visible = compact ? rows.slice(0, 5) : rows;

  return (
    <div className="w-full">
      <table className="w-full table-fixed border-separate border-spacing-0 text-left">
        {compact ? (
          <colgroup>
            <col className="w-[8%]" />
            <col className="w-[62%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
          </colgroup>
        ) : (
          <colgroup>
            <col className="w-[3%]" />
            <col className="w-[31%]" />
            <col className="w-[8.25%]" />
            <col className="w-[8.25%]" />
            <col className="w-[8.25%]" />
            <col className="w-[8.25%]" />
            <col className="w-[8.25%]" />
            <col className="w-[8.25%]" />
            <col className="w-[8.25%]" />
            <col className="w-[8.25%]" />
          </colgroup>
        )}
        {compact ? (
          <thead>
            <tr className="text-white/45">
              <th className="pb-4 text-left">#</th>
              <th className="pb-4 text-left">Team</th>
              <th className="pb-4 text-center">P</th>
              <th className="pb-4 text-center">Pts</th>
            </tr>
          </thead>
        ) : (
          <thead>
            <tr className="text-white/45">
              <th className="pb-4 text-left">#</th>
              <th className="pb-4 text-left">Team</th>
              <th className="pb-4 text-center">P</th>
              <th className="pb-4 text-center">W</th>
              <th className="pb-4 text-center">D</th>
              <th className="pb-4 text-center">L</th>
              <th className="pb-4 text-center">GF</th>
              <th className="pb-4 text-center">GA</th>
              <th className="pb-4 text-center">GD</th>
              <th className="pb-4 text-center">Pts</th>
            </tr>
          </thead>
        )}

        <tbody>
          {visible.map((row) => {
            const hawks = row.team === HULL_HAWKS_TEAM;

            return (
              <tr key={row.team} className={hawks ? "bg-[var(--red)]" : ""}>
                <td className="py-3 text-center">{row.position}</td>
                <td className="py-3 font-medium">{row.team}</td>
                <td className="py-3 text-center">{row.played}</td>
                {!compact && (
                  <>
                    <td className="py-3 text-center">{row.won}</td>
                    <td className="py-3 text-center">{row.drawn}</td>
                    <td className="py-3 text-center">{row.lost}</td>
                    <td className="text-center">{row.goalsFor}</td>
                    <td className="text-center">{row.goalsAgainst}</td>
                    <td className="text-center">{row.goalDifference}</td>
                  </>
                )}
                <td className="text-center font-semibold">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
