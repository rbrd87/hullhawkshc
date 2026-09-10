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
    <div className="w-full overflow-hidden">
      <table className="w-full border-separate border-spacing-0">
        {compact ? (
          <colgroup>
            <col className="w-[8%]" />
            <col className="w-[62%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
          </colgroup>
        ) : (
          <colgroup>
            <col className="w-[8%] sm:w-[5%]" />
            <col className="w-[52%] sm:w-[35%]" />
            <col className="w-[13%] sm:w-[7.5%]" />
            <col className="hidden sm:table-column sm:w-[7.5%]" />
            <col className="hidden sm:table-column sm:w-[7.5%]" />
            <col className="hidden sm:table-column sm:w-[7.5%]" />
            <col className="hidden lg:table-column lg:w-[7.5%]" />
            <col className="hidden lg:table-column lg:w-[7.5%]" />
            <col className="w-[13%] sm:w-[7.5%]" />
            <col className="w-[14%] sm:w-[7.5%]" />
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
              <th className="hidden pb-4 text-center sm:table-cell">W</th>
              <th className="hidden pb-4 text-center sm:table-cell">D</th>
              <th className="hidden pb-4 text-center sm:table-cell">L</th>
              <th className="hidden pb-4 text-center lg:table-cell">GF</th>
              <th className="hidden pb-4 text-center lg:table-cell">GA</th>
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

                <td className="py-3 pr-2 font-medium">
                  <span className="block truncate sm:whitespace-nowrap">
                    {row.team}
                  </span>
                </td>

                <td className="py-3 text-center">{row.played}</td>

                {!compact && (
                  <>
                    <td className="hidden py-3 text-center sm:table-cell">
                      {row.won}
                    </td>
                    <td className="hidden py-3 text-center sm:table-cell">
                      {row.drawn}
                    </td>
                    <td className="hidden py-3 text-center sm:table-cell">
                      {row.lost}
                    </td>
                    <td className="hidden py-3 text-center lg:table-cell">
                      {row.goalsFor}
                    </td>
                    <td className="hidden py-3 text-center lg:table-cell">
                      {row.goalsAgainst}
                    </td>
                    <td className="py-3 text-center">{row.goalDifference}</td>
                  </>
                )}

                <td className="py-3 text-center font-semibold">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
