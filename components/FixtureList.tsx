"use client";

import { useMemo, useState } from "react";
import {
  HULL_HAWKS_TEAM,
  isHawksHome,
  opponentForHawks,
  opponentLogoForHawks,
} from "@/lib/hockey";
import type { Fixture } from "@/types/hockey";

const fmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const monthFmt = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

function displayTeamName(name: string) {
  return name.replace(/\s+W(\d+)\b/g, " $1");
}

function FixtureRow({ fixture }: { fixture: Fixture }) {
  const homeIsHawks = fixture.homeTeam === HULL_HAWKS_TEAM;
  const awayIsHawks = fixture.awayTeam === HULL_HAWKS_TEAM;

  const homeLogo = homeIsHawks
    ? "/images/hull-hawks-logo.png"
    : opponentLogoForHawks(fixture);

  const awayLogo = awayIsHawks
    ? "/images/hull-hawks-logo.png"
    : opponentLogoForHawks(fixture);

  const hawksVenueLabel = homeIsHawks ? "Home" : "Away";

  return (
    <div className="py-5">
      {/* Mobile */}
      <div className="md:hidden">
        <p className="sports-text text-lg font-semibold uppercase">
          {fmt.format(new Date(`${fixture.date}T12:00:00`))}
        </p>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={homeLogo}
              alt={`${displayTeamName(fixture.homeTeam)} logo`}
              className={`shrink-0 object-contain ${
                homeIsHawks ? "h-8 w-10" : "h-9 w-9"
              }`}
            />
            <p className="sports-text min-w-0 text-xl font-semibold uppercase leading-tight">
              {displayTeamName(fixture.homeTeam)}
            </p>
          </div>

          <span className="sports-text text-lg font-normal uppercase text-white/25">
            vs
          </span>

          <div className="flex min-w-0 items-center justify-end gap-3 text-right">
            <p className="sports-text min-w-0 text-xl font-semibold uppercase leading-tight">
              {displayTeamName(fixture.awayTeam)}
            </p>
            <img
              src={awayLogo}
              alt={`${displayTeamName(fixture.awayTeam)} logo`}
              className={`shrink-0 object-contain ${
                awayIsHawks ? "h-8 w-10" : "h-9 w-9"
              }`}
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-white/45">
            {fixture.venue ?? "Venue TBC"} <span className="mx-1 text-white/20">•</span>{" "}
            {fixture.time ?? "TBC"}
          </p>
          <p className="sports-text mt-2 text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--red)]">
            {hawksVenueLabel}
          </p>
        </div>
      </div>

      {/* Desktop/tablet - unchanged layout */}
      <div className="hidden md:grid md:grid-cols-[150px_1fr_auto] md:items-center md:gap-4">
        <div>
          <p className="sports-text text-lg font-semibold uppercase">
            {fmt.format(new Date(`${fixture.date}T12:00:00`))}
          </p>
          <p className="mt-1 text-sm text-white/40">{fixture.time ?? "TBC"}</p>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <img
              src={homeLogo}
              alt={`${displayTeamName(fixture.homeTeam)} logo`}
              className={`shrink-0 object-contain ${
                homeIsHawks ? "h-8 w-10" : "h-9 w-9"
              }`}
            />
            <p className="sports-text text-xl font-semibold uppercase">
              {displayTeamName(fixture.homeTeam)}
            </p>
            <span className="sports-text mx-1 text-lg font-normal uppercase text-white/25">
              vs
            </span>
            <p className="sports-text text-xl font-semibold uppercase">
              {displayTeamName(fixture.awayTeam)}
            </p>
            <img
              src={awayLogo}
              alt={`${displayTeamName(fixture.awayTeam)} logo`}
              className={`shrink-0 object-contain ${
                awayIsHawks ? "h-8 w-10" : "h-9 w-9"
              }`}
            />
          </div>

          {fixture.venue && (
            <p className="mt-2 pl-12 text-sm text-white/40">{fixture.venue}</p>
          )}
        </div>

        <span className="sports-text w-fit rounded border border-white/15 px-3 py-2 text-[11px] font-medium uppercase tracking-[.14em] text-white/50">
          {hawksVenueLabel}
        </span>
      </div>
    </div>
  );
}

export function FixtureList({ fixtures }: { fixtures: Fixture[] }) {
  const groupedFixtures = useMemo(() => {
    const groups = new Map<
      string,
      { label: string; sortDate: Date; fixtures: Fixture[] }
    >();

    fixtures.forEach((fixture) => {
      const date = new Date(`${fixture.date}T12:00:00`);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!groups.has(key)) {
        groups.set(key, {
          label: monthFmt.format(date),
          sortDate: new Date(date.getFullYear(), date.getMonth(), 1),
          fixtures: [],
        });
      }

      groups.get(key)?.fixtures.push(fixture);
    });

    return Array.from(groups.entries())
      .map(([key, group]) => ({ key, ...group }))
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
  }, [fixtures]);

  const defaultOpenMonth = useMemo(() => {
    if (groupedFixtures.length === 0) return "";

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

    const currentMonth = groupedFixtures.find(
      (group) => group.key === currentMonthKey,
    );

    if (currentMonth) return currentMonth.key;

    const nextMonth = groupedFixtures.find(
      (group) =>
        group.sortDate.getTime() >=
        new Date(now.getFullYear(), now.getMonth(), 1).getTime(),
    );

    return nextMonth?.key ?? groupedFixtures[0].key;
  }, [groupedFixtures]);

  const [openMonth, setOpenMonth] = useState(defaultOpenMonth);

  return (
    <>
      {/* Mobile accordion */}
      <div className="border-y border-white/10 md:hidden">
        {groupedFixtures.map((group) => {
          const open = openMonth === group.key;

          return (
            <div
              key={group.key}
              className="border-b border-white/10 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setOpenMonth(open ? "" : group.key)}
                className="flex w-full items-center justify-between py-5 text-left"
                aria-expanded={open}
              >
                <span className="sports-text text-lg font-semibold uppercase tracking-[0.12em]">
                  {group.label}
                </span>

                <span
                  className={`text-2xl text-[var(--red)] transition-transform ${
                    open ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              {open && (
                <div className="divide-y divide-white/10">
                  {group.fixtures.map((fixture) => (
                    <FixtureRow key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop/tablet */}
      <div className="hidden divide-y divide-white/10 border-y border-white/10 md:block">
        {fixtures.map((fixture) => (
          <FixtureRow key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </>
  );
}
