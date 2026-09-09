import type { LeagueRow } from "@/types/hockey";
import { HULL_HAWKS_TEAM } from "@/lib/hockey";

export function LeagueTable({ rows }: { rows: LeagueRow[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-white/40">
            <tr>
              <th className="px-5 py-4">#</th>
              <th className="px-5 py-4">Team</th>
              <th className="px-3 py-4 text-center">P</th>
              <th className="px-3 py-4 text-center">W</th>
              <th className="px-3 py-4 text-center">D</th>
              <th className="px-3 py-4 text-center">L</th>
              <th className="px-3 py-4 text-center">GD</th>
              <th className="px-5 py-4 text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hawks = row.team === HULL_HAWKS_TEAM;
              return (
                <tr
                  key={row.team}
                  className={hawks ? "bg-[var(--hawk-lime)] text-[var(--ink)]" : "border-t border-white/10"}
                >
                  <td className="px-5 py-4 font-bold">{row.position}</td>
                  <td className="px-5 py-4 font-bold">{row.team}</td>
                  <td className="px-3 py-4 text-center">{row.played}</td>
                  <td className="px-3 py-4 text-center">{row.won}</td>
                  <td className="px-3 py-4 text-center">{row.drawn}</td>
                  <td className="px-3 py-4 text-center">{row.lost}</td>
                  <td className="px-3 py-4 text-center">
                    {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                  </td>
                  <td className="px-5 py-4 text-right text-lg font-black">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
