import type { Fixture, HawksData, LeagueRow, MatchStatus } from "@/types/hockey";

export const HULL_HAWKS_TEAM = "Hull Hawks 1";

const TEAM_ID = "c4895023-e50e-43c2-b13c-6489df4e23d5";
const COMPETITION_ID = "5161cc52-3c80-4dc8-b5e5-b72d3bd9f11e";
const COMPETITION_GROUP_ID = "9dfdae0a-8e6f-4131-a840-1fff2d899ce9";

const API_BASE = "https://ehdwapi.englandhockey.co.uk/api";
const REVALIDATE_SECONDS = 86_400;

type EnglandHockeyTeam = {
  teamName: string;
  clubLogoUrl?: string;
};

type EnglandHockeyFixture = {
  id: string;
  competitionId: string;
  fixtureDate: string;
  fixtureTime?: string;
  venue?: string;
  homeTeam: EnglandHockeyTeam;
  awayTeam: EnglandHockeyTeam;
  homeTeamScoreAsInt?: number;
  awayTeamScoreAsInt?: number;
  isResult: boolean;
  statusCode?: string;
  status?: string;
  statusDescription?: string;
};

type FixturesAndResultsCompetition = {
  competitionId: string;
  competitionName: string;
  fixtures: EnglandHockeyFixture[];
};

type EnglandHockeyTableRow = {
  competitionId: string;
  teamId: string;
  teamName: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesDrawn: number;
  gamesLost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  totalPoints: number;
};

type EnglandHockeyCompetitionTable = {
  id: string;
  name: string;
  table: EnglandHockeyTableRow[];
};

type CompetitionTablesResponse = {
  data: EnglandHockeyCompetitionTable[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const apiKey = process.env.ENGLAND_HOCKEY_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ENGLAND_HOCKEY_API_KEY");
  }

  const response = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
      Accept: "application/json",
      Referer: "https://yne.englandhockey.co.uk/",
    },
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(
      `England Hockey API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

function mapStatus(fixture: EnglandHockeyFixture): MatchStatus {
  if (fixture.isResult) {
    return "completed";
  }

  const statusText =
    `${fixture.status ?? ""} ${fixture.statusDescription ?? ""}`.toLowerCase();

  if (statusText.includes("postpon")) {
    return "postponed";
  }

  return "scheduled";
}

function mapFixture(fixture: EnglandHockeyFixture): Fixture {
  const completed = fixture.isResult;

  return {
    id: fixture.id,
    date: fixture.fixtureDate.split("T")[0],
    time:
      fixture.fixtureTime && fixture.fixtureTime !== "00:00"
        ? fixture.fixtureTime
        : undefined,
    homeTeam: fixture.homeTeam.teamName,
    awayTeam: fixture.awayTeam.teamName,
    homeLogoUrl: fixture.homeTeam.clubLogoUrl || undefined,
    awayLogoUrl: fixture.awayTeam.clubLogoUrl || undefined,
    homeScore: completed ? fixture.homeTeamScoreAsInt : undefined,
    awayScore: completed ? fixture.awayTeamScoreAsInt : undefined,
    venue: fixture.venue || undefined,
    status: mapStatus(fixture),
  };
}

function mapTable(rows: EnglandHockeyTableRow[]): LeagueRow[] {
  return rows.map((row, index) => ({
    position: index + 1,
    team: row.teamName,
    played: row.gamesPlayed,
    won: row.gamesWon,
    drawn: row.gamesDrawn,
    lost: row.gamesLost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    goalDifference: row.goalsDifference,
    points: row.totalPoints,
  }));
}

async function getFixtures(): Promise<Fixture[]> {
  const url = `${API_BASE}/teams/${TEAM_ID}/fixturesandresults`;

  const response = await fetchJson<FixturesAndResultsCompetition[]>(url);

  const league = response.find(
    (competition) => competition.competitionId === COMPETITION_ID,
  );

  if (!league) {
    throw new Error(
      "Hull Hawks league competition was not found in fixturesandresults.",
    );
  }

  return league.fixtures.map(mapFixture);
}

async function getTable(): Promise<LeagueRow[]> {
  const url = `${API_BASE}/competitiongroups/${COMPETITION_GROUP_ID}/tables`;

  const response = await fetchJson<CompetitionTablesResponse>(url);

  const competition = response.data.find(
    (item) => item.id === COMPETITION_ID,
  );

  if (!competition) {
    throw new Error(
      "Hull Hawks league table was not found in the competition group.",
    );
  }

  return mapTable(competition.table);
}

export async function getHawksData(): Promise<HawksData> {
  const [fixturesResult, tableResult] = await Promise.allSettled([
    getFixtures(),
    getTable(),
  ]);

  const fixtures =
    fixturesResult.status === "fulfilled" ? fixturesResult.value : [];

  const table =
    tableResult.status === "fulfilled" ? tableResult.value : [];

  if (fixturesResult.status === "rejected") {
    console.error(
      "Could not load Hull Hawks fixtures/results:",
      fixturesResult.reason,
    );
  }

  if (tableResult.status === "rejected") {
    console.error(
      "Could not load Hull Hawks league table:",
      tableResult.reason,
    );
  }

  return {
    fixtures,
    table,
    source: "england-hockey",
  };
}

export function getUpcomingFixtures(fixtures: Fixture[]) {
  return fixtures
    .filter((fixture) => fixture.status === "scheduled")
    .sort((a, b) => {
      const aDateTime = `${a.date}T${a.time ?? "23:59"}`;
      const bDateTime = `${b.date}T${b.time ?? "23:59"}`;

      return aDateTime.localeCompare(bDateTime);
    });
}

export function getResults(fixtures: Fixture[]) {
  return fixtures
    .filter((fixture) => fixture.status === "completed")
    .sort((a, b) => {
      const aDateTime = `${a.date}T${a.time ?? "00:00"}`;
      const bDateTime = `${b.date}T${b.time ?? "00:00"}`;

      return bDateTime.localeCompare(aDateTime);
    });
}

export function resultForHawks(fixture: Fixture): "W" | "D" | "L" | null {
  if (
    fixture.status !== "completed" ||
    fixture.homeScore === undefined ||
    fixture.awayScore === undefined
  ) {
    return null;
  }

  const hawksAreHome = fixture.homeTeam === HULL_HAWKS_TEAM;

  const hawksScore = hawksAreHome
    ? fixture.homeScore
    : fixture.awayScore;

  const opponentScore = hawksAreHome
    ? fixture.awayScore
    : fixture.homeScore;

  if (hawksScore > opponentScore) return "W";
  if (hawksScore < opponentScore) return "L";

  return "D";
}

export function opponentForHawks(fixture: Fixture) {
  return fixture.homeTeam === HULL_HAWKS_TEAM
    ? fixture.awayTeam
    : fixture.homeTeam;
}

const opponentLogos: Record<string, string> = {
  "Driffield W2": "/images/opponents/driffield.png",
  "Grimsby W1": "/images/opponents/grimsby.png",
  "Horncastle W1": "/images/opponents/horncastle.png",
  "Kingston Upon Hull W2": "/images/opponents/kuh.png",
  "Lindum W3": "/images/opponents/lindum.png",
  "Louth W1": "/images/opponents/louth.png",
  "Rotherham W2": "/images/opponents/rotherham.png",
  "Sheffield University Bankers W3": "/images/opponents/sheff-bankers.png",
  "University of Hull W1": "/images/opponents/hull-uni.png",
};

export function opponentLogoForHawks(fixture: Fixture) {
  const opponent = opponentForHawks(fixture);

  const normalisedOpponent = opponent
    .toLowerCase()
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const matchingTeam = Object.keys(opponentLogos).find((team) => {
    const normalisedTeam = team
      .toLowerCase()
      .replace(/[-–—]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return normalisedTeam === normalisedOpponent;
  });

  return matchingTeam ? opponentLogos[matchingTeam] : undefined;
}

export function isHawksHome(fixture: Fixture) {
  return fixture.homeTeam === HULL_HAWKS_TEAM;
}