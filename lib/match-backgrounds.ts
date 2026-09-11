export type MatchBackground = {
  id: string;
  name: string;
  location: string;
  image: string;

  // Starting crop settings for this specific image
  defaultPosition: number;
  defaultZoom: number;
};

export const MATCH_BACKGROUNDS: MatchBackground[] = [
  {
    id: "hull-deep",
    name: "The Deep",
    location: "Hull",
    image: "/images/match-backgrounds/hull-deep.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },
  {
    id: "hull-humber-bridge",
    name: "Humber Bridge",
    location: "Hull",
    image: "/images/match-backgrounds/hull-humber-bridge.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },
  {
    id: "hull-city-hall",
    name: "Hull City Hall",
    location: "Hull",
    image: "/images/match-backgrounds/hull-city-hall.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },
  {
    id: "louth-st-james",
    name: "St James' Church",
    location: "Louth",
    image: "/images/match-backgrounds/louth-st-james.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },

  {
    id: "grimsby-dock-tower",
    name: "Dock Tower",
    location: "Grimsby",
    image: "/images/match-backgrounds/grimsby-dock-tower.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },

  {
    id: "horncastle",
    name: "Horncastle",
    location: "Horncastle",
    image: "/images/match-backgrounds/horncastle.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },

  {
    id: "driffield",
    name: "Driffield",
    location: "Driffield",
    image: "/images/match-backgrounds/driffield.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },

  {
    id: "lincoln-cathedral",
    name: "Lincoln Cathedral",
    location: "Lincoln",
    image: "/images/match-backgrounds/lincoln-cathedral.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },

  {
    id: "rotherham",
    name: "Rotherham",
    location: "Rotherham",
    image: "/images/match-backgrounds/rotherham.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },

  {
    id: "sheffield",
    name: "Sheffield",
    location: "Sheffield",
    image: "/images/match-backgrounds/sheffield.jpg",
    defaultPosition: 50,
    defaultZoom: 100,
  },
];

const HOME_TEAM_BACKGROUND: Record<string, string> = {
  // Hull
  "Hull Hawks 1": "hull-deep",
  "University of Hull W1": "hull-deep",
  "Kingston Upon Hull W2": "hull-deep",

  // Away clubs
  "Louth W1": "louth-st-james",
  "Grimsby W1": "grimsby-dock-tower",
  "Horncastle W1": "horncastle",
  "Driffield W2": "driffield",
  "Lindum W3": "lincoln-cathedral",
  "Rotherham W2": "rotherham",
  "Sheffield University Bankers W3": "sheffield",
};

function normaliseTeamName(team: string) {
  return team.toLowerCase().replace(/[-–—]/g, " ").replace(/\s+/g, " ").trim();
}

export function getMatchBackground(id: string): MatchBackground {
  return (
    MATCH_BACKGROUNDS.find((background) => background.id === id) ??
    MATCH_BACKGROUNDS[0]
  );
}

export function automaticBackgroundForTeam(homeTeam: string): MatchBackground {
  const normalisedHomeTeam = normaliseTeamName(homeTeam);

  const matchingTeam = Object.keys(HOME_TEAM_BACKGROUND).find(
    (team) => normaliseTeamName(team) === normalisedHomeTeam,
  );

  const backgroundId = matchingTeam
    ? HOME_TEAM_BACKGROUND[matchingTeam]
    : "hull-deep";

  return getMatchBackground(backgroundId);
}
