"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Fixture } from "@/types/hockey";
import { displayTeamName, HULL_HAWKS_TEAM } from "@/lib/hockey";

type Formation = "4-3-3" | "3-4-3" | "4-4-2";
type SavedSelection = {
  formation: Formation;
  players: string[];
  starters: Record<string, string>;
  bench: string[];
};

const STORAGE_KEY = "hawks-matchday-selections";

const FORMATIONS: Record<Formation, { id: string; label: string; x: number; y: number }[]> = {
  "4-3-3": [
    { id: "gk", label: "GK", x: 50, y: 91 },
    { id: "lb", label: "LB", x: 15, y: 72 }, { id: "lcb", label: "CB", x: 38, y: 76 },
    { id: "rcb", label: "CB", x: 62, y: 76 }, { id: "rb", label: "RB", x: 85, y: 72 },
    { id: "lm", label: "MID", x: 24, y: 48 }, { id: "cm", label: "MID", x: 50, y: 53 },
    { id: "rm", label: "MID", x: 76, y: 48 },
    { id: "lf", label: "FWD", x: 22, y: 23 }, { id: "cf", label: "FWD", x: 50, y: 18 },
    { id: "rf", label: "FWD", x: 78, y: 23 },
  ],
  "3-4-3": [
    { id: "gk", label: "GK", x: 50, y: 91 },
    { id: "ld", label: "DEF", x: 22, y: 73 }, { id: "cd", label: "DEF", x: 50, y: 78 },
    { id: "rd", label: "DEF", x: 78, y: 73 },
    { id: "lm", label: "MID", x: 12, y: 48 }, { id: "lcm", label: "MID", x: 38, y: 53 },
    { id: "rcm", label: "MID", x: 62, y: 53 }, { id: "rm", label: "MID", x: 88, y: 48 },
    { id: "lf", label: "FWD", x: 22, y: 22 }, { id: "cf", label: "FWD", x: 50, y: 17 },
    { id: "rf", label: "FWD", x: 78, y: 22 },
  ],
  "4-4-2": [
    { id: "gk", label: "GK", x: 50, y: 91 },
    { id: "lb", label: "LB", x: 15, y: 72 }, { id: "lcb", label: "CB", x: 38, y: 76 },
    { id: "rcb", label: "CB", x: 62, y: 76 }, { id: "rb", label: "RB", x: 85, y: 72 },
    { id: "lm", label: "MID", x: 12, y: 47 }, { id: "lcm", label: "MID", x: 38, y: 52 },
    { id: "rcm", label: "MID", x: 62, y: 52 }, { id: "rm", label: "MID", x: 88, y: 47 },
    { id: "lf", label: "FWD", x: 34, y: 20 }, { id: "rf", label: "FWD", x: 66, y: 20 },
  ],
};

function emptySelection(): SavedSelection {
  return { formation: "4-3-3", players: [], starters: {}, bench: [] };
}

function fixtureLabel(fixture: Fixture) {
  const opponent =
    fixture.homeTeam === HULL_HAWKS_TEAM ? fixture.awayTeam : fixture.homeTeam;
  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  }).format(new Date(`${fixture.date}T12:00:00`));
  return `${date} · ${fixture.homeTeam === HULL_HAWKS_TEAM ? "vs" : "at"} ${displayTeamName(opponent)}`;
}

export default function SelectionBuilder({ fixtures }: { fixtures: Fixture[] }) {
  const [fixtureId, setFixtureId] = useState(fixtures[0]?.id ?? "general");
  const [selection, setSelection] = useState<SavedSelection>(emptySelection);
  const [newPlayer, setNewPlayer] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, SavedSelection>;
      setSelection(all[fixtureId] ?? emptySelection());
    } catch {
      setSelection(emptySelection());
    }
    setSaved(false);
  }, [fixtureId]);

  const assigned = useMemo(() => new Set(Object.values(selection.starters).filter(Boolean)), [selection.starters]);
  const availableForBench = selection.players.filter((p) => !assigned.has(p));

  function updateFormation(formation: Formation) {
    const validIds = new Set(FORMATIONS[formation].map((slot) => slot.id));
    const starters = Object.fromEntries(
      Object.entries(selection.starters).filter(([id]) => validIds.has(id)),
    );
    setSelection({ ...selection, formation, starters });
    setSaved(false);
  }

  function addPlayer() {
    const name = newPlayer.trim();
    if (!name || selection.players.some((p) => p.toLowerCase() === name.toLowerCase())) return;
    setSelection({ ...selection, players: [...selection.players, name].sort((a, b) => a.localeCompare(b)) });
    setNewPlayer("");
    setSaved(false);
  }

  function assign(slotId: string, player: string) {
    const starters = { ...selection.starters };
    for (const [id, name] of Object.entries(starters)) {
      if (name === player) delete starters[id];
    }
    if (player) starters[slotId] = player;
    else delete starters[slotId];
    setSelection({ ...selection, starters, bench: selection.bench.filter((p) => p !== player) });
    setSaved(false);
  }

  function toggleBench(player: string) {
    const bench = selection.bench.includes(player)
      ? selection.bench.filter((p) => p !== player)
      : [...selection.bench, player];
    setSelection({ ...selection, bench });
    setSaved(false);
  }

  function removePlayer(player: string) {
    const starters = Object.fromEntries(Object.entries(selection.starters).filter(([, p]) => p !== player));
    setSelection({
      ...selection,
      players: selection.players.filter((p) => p !== player),
      starters,
      bench: selection.bench.filter((p) => p !== player),
    });
    setSaved(false);
  }

  function saveSelection() {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, SavedSelection>;
    all[fixtureId] = selection;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setSaved(true);
  }

  const startingCount = Object.values(selection.starters).filter(Boolean).length;
  const selectedCount = startingCount + selection.bench.length;

  return (
    <main className="min-h-screen bg-[var(--black)] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 border-b border-white/10 pb-7">
          <Link href="/admin" className="sports-text text-xs font-semibold uppercase tracking-[.12em] text-white/35 hover:text-white">
            ← Admin
          </Link>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--red)]">Matchday</p>
              <h1 className="sports-text mt-2 text-5xl font-bold uppercase tracking-tight sm:text-6xl">Selection</h1>
              <p className="mt-2 text-sm text-white/45">Build and manage the matchday squad.</p>
            </div>
            <button onClick={saveSelection} className="sports-text min-h-11 rounded-lg bg-[var(--red)] px-6 py-3 text-sm font-semibold uppercase tracking-[.08em] hover:bg-[var(--red-dark)]">
              {saved ? "✓ Saved" : "Save Selection"}
            </button>
          </div>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="meta text-white/40">Fixture</label>
            <select value={fixtureId} onChange={(e) => setFixtureId(e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-[#161618] px-4 text-white outline-none focus:border-[var(--red)]">
              {fixtures.length === 0 && <option value="general">General squad</option>}
              {fixtures.map((fixture) => <option key={fixture.id} value={fixture.id}>{fixtureLabel(fixture)}</option>)}
            </select>
          </div>
          <div>
            <label className="meta text-white/40">Formation</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(Object.keys(FORMATIONS) as Formation[]).map((formation) => (
                <button key={formation} onClick={() => updateFormation(formation)} className={`sports-text min-h-12 rounded-lg border px-3 font-semibold ${selection.formation === formation ? "border-[var(--red)] bg-[var(--red)]/15 text-white" : "border-white/10 bg-white/[.03] text-white/45"}`}>
                  {formation}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
          <section className="panel rounded-xl p-3 sm:p-5">
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <p className="meta text-white/35">Starting XI</p>
                <p className="sports-text mt-1 text-xl font-semibold uppercase">{startingCount}/11 selected</p>
              </div>
              <span className="sports-text text-sm text-white/30">{selection.formation}</span>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/15 bg-[#18271e] sm:aspect-[4/3]">
              <div className="absolute inset-[4%] rounded-[42%] border border-white/35" />
              <div className="absolute left-[4%] right-[4%] top-1/2 border-t border-white/35" />
              <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35" />
              <div className="absolute left-[22%] right-[22%] top-[4%] h-[15%] border-x border-b border-white/35" />
              <div className="absolute bottom-[4%] left-[22%] right-[22%] h-[15%] border-x border-t border-white/35" />

              {FORMATIONS[selection.formation].map((slot) => (
                <div key={slot.id} className="absolute z-10 w-[27%] -translate-x-1/2 -translate-y-1/2 sm:w-[23%]" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  <select
                    aria-label={slot.label}
                    value={selection.starters[slot.id] ?? ""}
                    onChange={(e) => assign(slot.id, e.target.value)}
                    className={`sports-text w-full rounded-md border px-1 py-2 text-center text-[10px] font-semibold uppercase outline-none sm:text-xs ${selection.starters[slot.id] ? "border-[var(--red)] bg-[var(--red)] text-white" : "border-white/20 bg-black/75 text-white/45"}`}
                  >
                    <option value="">{slot.label}</option>
                    {selection.players.map((player) => (
                      <option key={player} value={player} disabled={assigned.has(player) && selection.starters[slot.id] !== player}>{player}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/[.025] p-4">
              <div className="flex items-center justify-between">
                <p className="sports-text font-semibold uppercase">Bench</p>
                <span className="text-xs text-white/35">{selection.bench.length} selected</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selection.bench.length === 0 ? <p className="text-sm text-white/30">No substitutes selected yet.</p> : selection.bench.map((player) => (
                  <button key={player} onClick={() => toggleBench(player)} className="rounded-full border border-[var(--red)]/40 bg-[var(--red)]/10 px-3 py-1.5 text-sm text-white/80">{player} ×</button>
                ))}
              </div>
            </div>
          </section>

          <aside className="panel h-fit rounded-xl p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="meta text-white/35">Players</p>
                <h2 className="sports-text mt-1 text-2xl font-bold uppercase">Squad</h2>
              </div>
              <span className="sports-text text-sm text-white/35">{selectedCount} matchday</span>
            </div>

            <div className="mt-5 flex gap-2">
              <input value={newPlayer} onChange={(e) => setNewPlayer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPlayer()} placeholder="Player name" className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-[#161618] px-3 text-sm outline-none placeholder:text-white/25 focus:border-[var(--red)]" />
              <button onClick={addPlayer} className="sports-text rounded-lg bg-white/10 px-4 text-sm font-semibold uppercase hover:bg-white/15">Add</button>
            </div>

            <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {selection.players.length === 0 ? (
                <p className="py-8 text-center text-sm leading-6 text-white/30">Add your players here, then choose the starting XI on the pitch.</p>
              ) : selection.players.map((player) => {
                const starting = assigned.has(player);
                const benched = selection.bench.includes(player);
                return (
                  <div key={player} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{player}</p>
                      <p className="mt-0.5 text-xs text-white/30">{starting ? "Starting XI" : benched ? "Bench" : "Not selected"}</p>
                    </div>
                    {!starting && <button onClick={() => toggleBench(player)} className={`sports-text rounded px-2.5 py-1.5 text-[10px] font-semibold uppercase ${benched ? "bg-[var(--red)] text-white" : "bg-white/5 text-white/45"}`}>{benched ? "Bench ✓" : "Bench"}</button>}
                    <button onClick={() => removePlayer(player)} aria-label={`Remove ${player}`} className="px-1 text-white/20 hover:text-red-300">×</button>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs leading-5 text-white/25">For this first version, selections are saved only in this browser on this device.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
