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
        <thead>
          <tr className="text-[11px] uppercase tracking-[.12em] text-white/42">
            <th className="w-9 border-b border-white/10 py-3">#</th>
            <th className="border-b border-white/10 py-3">Team</th>
            <th className="w-12 border-b border-white/10 py-3 text-center">P</th>
            {!compact && (
              <th className="w-12 border-b border-white/10 py-3 text-center">GD</th>
            )}
            <th className="w-14 border-b border-white/10 py-3 text-right">Pts</th>
          </tr>
        </thead>

        <tbody>
          {visible.map((row) => {
            const hawks = row.team === HULL_HAWKS_TEAM;

            return (
              <tr key={row.team} className={hawks ? "bg-[var(--red)]" : ""}>
                <td
                  className={`py-3 pl-2 text-base font-medium ${
                    hawks ? "" : "border-b border-white/[.07]"
                  }`}
                >
                  {row.position}
                </td>

                <td
                  className={`sports-text truncate py-3 text-lg font-semibold ${
                    hawks ? "" : "border-b border-white/[.07]"
                  }`}
                >
                  {row.team}
                </td>

                <td
                  className={`py-3 text-center text-base ${
                    hawks ? "" : "border-b border-white/[.07]"
                  }`}
                >
                  {row.played}
                </td>

                {!compact && (
                  <td
                    className={`py-3 text-center text-base ${
                      hawks ? "" : "border-b border-white/[.07]"
                    }`}
                  >
                    {row.goalDifference > 0 ? "+" : ""}
                    {row.goalDifference}
                  </td>
                )}

                <td
                  className={`py-3 pr-2 text-right text-base font-semibold ${
                    hawks ? "" : "border-b border-white/[.07]"
                  }`}
                >
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
