import type { Fixture, HawksData, LeagueRow } from "@/types/hockey";

export const HULL_HAWKS_TEAM = "Hull Hawks 1";

export async function getHawksData(): Promise<HawksData> {
  // When the authorised England Hockey endpoint is available, replace this
  // with fetch(url, { next: { revalidate: 86_400 } })
  return getDemoData();
}

export function getUpcomingFixtures(fixtures: Fixture[]) {
  return fixtures
    .filter((fixture) => fixture.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getResults(fixtures: Fixture[]) {
  return fixtures
    .filter((fixture) => fixture.status === "completed")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function resultForHawks(fixture: Fixture): "W" | "D" | "L" | null {
  if (fixture.status !== "completed" || fixture.homeScore === undefined || fixture.awayScore === undefined) {
    return null;
  }

  const home = fixture.homeTeam === HULL_HAWKS_TEAM;
  const hawks = home ? fixture.homeScore : fixture.awayScore;
  const opponent = home ? fixture.awayScore : fixture.homeScore;

  if (hawks > opponent) return "W";
  if (hawks < opponent) return "L";
  return "D";
}

export function opponentForHawks(fixture: Fixture) {
  return fixture.homeTeam === HULL_HAWKS_TEAM ? fixture.awayTeam : fixture.homeTeam;
}

export function isHawksHome(fixture: Fixture) {
  return fixture.homeTeam === HULL_HAWKS_TEAM;
}

function getDemoData(): HawksData {
  const fixtures: Fixture[] = [
    {
      id: "demo-result",
      date: "2026-09-05",
      time: "13:30",
      homeTeam: "Hull Hawks 1",
      awayTeam: "Demo Opposition",
      homeScore: 3,
      awayScore: 1,
      venue: "Demo venue",
      status: "completed",
    },
    {
      id: "demo-next",
      date: "2026-09-19",
      time: "13:30",
      homeTeam: "Hull Hawks 1",
      awayTeam: "Demo Opposition",
      venue: "Demo venue",
      status: "scheduled",
    },
    {
      id: "demo-away",
      date: "2026-09-26",
      time: "12:00",
      homeTeam: "Demo Away Team",
      awayTeam: "Hull Hawks 1",
      venue: "Demo venue",
      status: "scheduled",
    }
  ];

  const table: LeagueRow[] = [
    { position: 1, team: "Demo Leaders", played: 2, won: 2, drawn: 0, lost: 0, goalDifference: 5, points: 6 },
    { position: 2, team: "Hull Hawks 1", played: 2, won: 1, drawn: 1, lost: 0, goalDifference: 2, points: 4 },
    { position: 3, team: "Demo Opposition", played: 2, won: 1, drawn: 0, lost: 1, goalDifference: 0, points: 3 },
    { position: 4, team: "Demo Team Four", played: 2, won: 0, drawn: 1, lost: 1, goalDifference: -2, points: 1 }
  ];

  return { fixtures, table, source: "demo" };
}
