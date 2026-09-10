export type MatchStatus = "scheduled" | "completed" | "postponed";

export interface Fixture {
  id: string;
  date: string;
  time?: string;
  homeTeam: string;
  awayTeam: string;
  homeLogoUrl?: string;
  awayLogoUrl?: string;
  homeScore?: number;
  awayScore?: number;
  venue?: string;
  status: MatchStatus;
}

export interface LeagueRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface HawksData {
  fixtures: Fixture[];
  table: LeagueRow[];
  source: "demo" | "england-hockey";
}