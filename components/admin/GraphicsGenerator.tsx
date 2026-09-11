"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { toPng } from "html-to-image";

import type { Fixture } from "@/types/hockey";

import {
  automaticBackgroundForTeam,
  getMatchBackground,
  MATCH_BACKGROUNDS,
} from "@/lib/match-backgrounds";

type GraphicType = "next-match" | "full-time";

type BackgroundMode = "automatic" | "manual";

type GraphicsFixture = Fixture & {
  homeLogo: string;
  awayLogo: string;
};

type Props = {
  fixtures: GraphicsFixture[];
};

const COMPETITION_NAME = "YNE PEAK & WOLD WOMEN'S DIVISION 1";

const DEFAULT_BACKGROUND_POSITION = 50;
const DEFAULT_BACKGROUND_ZOOM = 100;

const BACKGROUND_SETTINGS_STORAGE_KEY = "hawks-match-background-settings";

type SavedBackgroundSettings = Record<
  string,
  {
    position: number;
    zoom: number;
  }
>;

function getSavedBackgroundSettings(): SavedBackgroundSettings {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const saved = window.localStorage.getItem(BACKGROUND_SETTINGS_STORAGE_KEY);

    if (!saved) {
      return {};
    }

    return JSON.parse(saved) as SavedBackgroundSettings;
  } catch {
    return {};
  }
}

function getBackgroundDefaults(background: {
  id: string;
  defaultPosition: number;
  defaultZoom: number;
}) {
  const savedSettings = getSavedBackgroundSettings();

  const saved = savedSettings[background.id];

  return {
    position: saved?.position ?? background.defaultPosition,
    zoom: saved?.zoom ?? background.defaultZoom,
  };
}

function formatFixtureDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
    .format(new Date(`${date}T12:00:00`))
    .toUpperCase()
    .replace(",", "");
}

function formatFixtureOption(fixture: GraphicsFixture) {
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${fixture.date}T12:00:00`));

  return `${date} — ${fixture.homeTeam} vs ${fixture.awayTeam}`;
}

function resultHeadline(
  fixture: GraphicsFixture,
  homeScore: string,
  awayScore: string,
) {
  if (homeScore === "" || awayScore === "") {
    return "";
  }

  const parsedHome = Number(homeScore);
  const parsedAway = Number(awayScore);

  if (Number.isNaN(parsedHome) || Number.isNaN(parsedAway)) {
    return "";
  }

  const hawksAreHome = fixture.homeTeam === "Hull Hawks 1";
  const hawksScore = hawksAreHome ? parsedHome : parsedAway;
  const opponentScore = hawksAreHome ? parsedAway : parsedHome;

  if (hawksScore > opponentScore) {
    return "HAWKS TAKE THE WIN";
  }
  if (hawksScore === opponentScore) {
    return "POINTS SHARED";
  }
  return "FULL TIME";
}

function GraphicBackground({
  image,
  position,
  zoom,
}: {
  image: string;
  position: number;
  zoom: number;
}) {
  const zoomScale = zoom / 100;
  const verticalOffset = ((position - 50) / 50) * 18;

  return (
    <>
      <div className="absolute inset-0 overflow-hidden bg-black">
        {/* Background fill.
            This prevents empty edges when zooming below 100%. */}
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
        />

        {/* Actual adjustable image */}
        <img
          src={image}
          alt=""
          onError={(event) => {
            const target = event.currentTarget;

            if (target.src.endsWith("/images/hawks-hero.jpg")) {
              return;
            }

            target.src = "/images/hawks-hero.jpg";
          }}
          className="absolute left-1/2 top-1/2 h-full w-full object-contain"
          style={{
            transform: `
              translate(-50%, -50%)
              translateY(${verticalOffset}%)
              scale(${zoomScale})
            `,
            transformOrigin: "center",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-black/52" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.20)_0%,rgba(0,0,0,.30)_38%,rgba(0,0,0,.72)_100%)]" />
    </>
  );
}

function SafeAreaOverlay() {
  return (
    <div
      data-export-ignore="true"
      className="pointer-events-none absolute inset-[7%] z-50 border border-dashed border-red-400/80"
    >
      <span className="absolute -top-6 right-0 rounded bg-black/75 px-2 py-1 font-sans text-[10px] uppercase tracking-[.12em] text-red-300">
        Safe area
      </span>
    </div>
  );
}

function Crest({ team, logo }: { team: string; logo: string }) {
  const isHawks = team === "Hull Hawks 1";

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <div
        className={`flex items-center justify-center ${
          isHawks ? "h-[15cqw] w-[18cqw] -my-[1cqw]" : "h-[13cqw] w-[13cqw]"
        }`}
      >
        <img
          src={logo}
          alt={`${team} logo`}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <p className="sports-text mt-[1.5cqw] w-[21cqw] text-center text-[2.8cqw] font-semibold uppercase leading-[.95] text-white">
        {team}
      </p>
    </div>
  );
}

function NextMatchGraphic({
  fixture,
  showSafeArea,
  backgroundImage,
  backgroundPosition,
  backgroundZoom,
}: {
  fixture: GraphicsFixture;
  showSafeArea: boolean;
  backgroundImage: string;
  backgroundPosition: number;
  backgroundZoom: number;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      style={{
        containerType: "inline-size",
      }}
    >
      <GraphicBackground
        image={backgroundImage}
        position={backgroundPosition}
        zoom={backgroundZoom}
      />

      {showSafeArea && <SafeAreaOverlay />}

      <p className="sports-text absolute left-1/2 top-[9%] w-[82%] -translate-x-1/2 text-center text-[2.5cqw] font-semibold uppercase tracking-[.08em] text-white">
        {COMPETITION_NAME}
      </p>

      <img
        src="/images/next-script.png"
        alt="Next"
        className="absolute left-1/2 top-[18%] z-10 w-[27%] -translate-x-1/2 object-contain"
      />

      <p className="sports-text absolute left-1/2 top-[24%] w-[78%] -translate-x-1/2 text-center text-[21cqw] font-bold uppercase leading-[.72] tracking-[-.055em] text-white">
        Match
      </p>

      <div className="absolute left-1/2 top-[48%] flex w-[60%] -translate-x-1/2 items-center justify-between">
        <p className="sports-text whitespace-nowrap text-[3.5cqw] font-semibold uppercase text-white">
          {formatFixtureDate(fixture.date)}
        </p>

        <p className="sports-text whitespace-nowrap text-[3.5cqw] font-semibold uppercase text-white">
          PB {fixture.time ?? "TBC"}
        </p>
      </div>

      <p className="sports-text absolute left-1/2 top-[56%] w-[72%] -translate-x-1/2 text-center text-[3.3cqw] font-semibold uppercase leading-tight text-white">
        {fixture.venue ?? "Venue TBC"}
      </p>

      <div className="absolute left-1/2 top-[66%] flex w-[48%] -translate-x-1/2 items-start justify-between gap-[6cqw]">
        <Crest team={fixture.homeTeam} logo={fixture.homeLogo} />

        <Crest team={fixture.awayTeam} logo={fixture.awayLogo} />
      </div>
    </div>
  );
}

function FullTimeGraphic({
  fixture,
  homeScore,
  awayScore,
  headline,
  showSafeArea,
  backgroundImage,
  backgroundPosition,
  backgroundZoom,
}: {
  fixture: GraphicsFixture;
  homeScore: string;
  awayScore: string;
  headline: string;
  showSafeArea: boolean;
  backgroundImage: string;
  backgroundPosition: number;
  backgroundZoom: number;
}) {
  const displayHomeScore = homeScore === "" ? "–" : homeScore;

  const displayAwayScore = awayScore === "" ? "–" : awayScore;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      style={{
        containerType: "inline-size",
      }}
    >
      <GraphicBackground
        image={backgroundImage}
        position={backgroundPosition}
        zoom={backgroundZoom}
      />

      {showSafeArea && <SafeAreaOverlay />}

      {/* Competition */}
      <p className="sports-text absolute left-1/2 top-[9%] w-[82%] -translate-x-1/2 text-center text-[2.5cqw] font-semibold uppercase tracking-[.08em] text-white">
        {COMPETITION_NAME}
      </p>

      {/* Full Time - deliberately much larger */}
      <p className="sports-text absolute left-1/2 top-[17%] w-[88%] -translate-x-1/2 text-center text-[20cqw] font-bold uppercase leading-[.76] tracking-[-.055em] text-white">
        Full Time
      </p>

      {/* Score - lifted away from the badges */}
      <div className="sports-text absolute left-1/2 top-[38%] flex -translate-x-1/2 items-center justify-center">
        <span className="min-w-[17cqw] text-center text-[18cqw] font-bold leading-none tracking-[-.06em] text-white">
          {displayHomeScore}
        </span>

        <span className="mx-[3cqw] text-[4.5cqw] font-light text-white/35">
          —
        </span>

        <span className="min-w-[17cqw] text-center text-[18cqw] font-bold leading-none tracking-[-.06em] text-white">
          {displayAwayScore}
        </span>
      </div>

      {/* Result headline */}
      {headline && (
        <div className="absolute left-1/2 top-[53%] w-[72%] -translate-x-1/2 text-center">
          <div className="mx-auto mb-[1.8cqw] h-[0.35cqw] w-[9cqw] bg-[var(--red)]" />

          <p className="sports-text text-[3.5cqw] font-semibold uppercase tracking-[.07em] text-white">
            {headline}
          </p>
        </div>
      )}

      {/* Teams - same position as Next Match */}
      <div className="absolute left-1/2 top-[66%] flex w-[48%] -translate-x-1/2 items-start justify-between gap-[6cqw]">
        <Crest team={fixture.homeTeam} logo={fixture.homeLogo} />

        <Crest team={fixture.awayTeam} logo={fixture.awayLogo} />
      </div>

      {/* Date and venue - brought upwards */}
      <div className="absolute left-1/2 top-[84%] w-[72%] -translate-x-1/2 text-center">
        <p className="sports-text text-[2.5cqw] font-medium uppercase tracking-[.06em] text-white/65">
          {formatFixtureDate(fixture.date)}
        </p>

        {fixture.venue && (
          <p className="sports-text mt-[0.8cqw] text-[2.1cqw] font-medium uppercase tracking-[.05em] text-white/40">
            {fixture.venue}
          </p>
        )}
      </div>
    </div>
  );
}

export default function GraphicsGenerator({ fixtures }: Props) {
  const artworkRef = useRef<HTMLDivElement>(null);

  const upcomingFixtures = useMemo(
    () =>
      fixtures
        .filter((fixture) => fixture.status === "scheduled")
        .sort((a, b) => a.date.localeCompare(b.date)),
    [fixtures],
  );

  const fullTimeFixtures = useMemo(() => {
    const now = Date.now();

    return [...fixtures].sort((a, b) => {
      const aDistance = Math.abs(
        new Date(`${a.date}T12:00:00`).getTime() - now,
      );

      const bDistance = Math.abs(
        new Date(`${b.date}T12:00:00`).getTime() - now,
      );

      return aDistance - bDistance;
    });
  }, [fixtures]);

  const initialFixture =
    upcomingFixtures[0] ?? fullTimeFixtures[0] ?? fixtures[0];

  const [graphicType, setGraphicType] = useState<GraphicType>("next-match");

  const [fixtureId, setFixtureId] = useState(initialFixture?.id ?? "");

  const [showSafeArea, setShowSafeArea] = useState(true);

  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>("automatic");

  const [manualBackgroundId, setManualBackgroundId] = useState("hull");

  const [backgroundPosition, setBackgroundPosition] = useState(
    DEFAULT_BACKGROUND_POSITION,
  );

  const [backgroundZoom, setBackgroundZoom] = useState(DEFAULT_BACKGROUND_ZOOM);

  const [isDownloading, setIsDownloading] = useState(false);

  const [savedBackgroundId, setSavedBackgroundId] = useState<string | null>(
    null,
  );

  const selectedFixture =
    fixtures.find((fixture) => fixture.id === fixtureId) ?? initialFixture;

  const [homeScore, setHomeScore] = useState(
    selectedFixture?.homeScore?.toString() ?? "",
  );

  const [awayScore, setAwayScore] = useState(
    selectedFixture?.awayScore?.toString() ?? "",
  );

  const [headline, setHeadline] = useState(
    selectedFixture
      ? resultHeadline(
          selectedFixture,
          selectedFixture.homeScore?.toString() ?? "",
          selectedFixture.awayScore?.toString() ?? "",
        )
      : "",
  );

  const automaticBackground = selectedFixture
    ? automaticBackgroundForTeam(selectedFixture.homeTeam)
    : MATCH_BACKGROUNDS[0];

  const selectedBackground =
    backgroundMode === "automatic"
      ? automaticBackground
      : getMatchBackground(manualBackgroundId);

  useEffect(() => {
    const defaults = getBackgroundDefaults(selectedBackground);

    setBackgroundPosition(defaults.position);

    setBackgroundZoom(defaults.zoom);

    setSavedBackgroundId(null);
  }, [selectedBackground.id]);

  function setScoresForFixture(fixture: GraphicsFixture) {
    const nextHomeScore = fixture.homeScore?.toString() ?? "";

    const nextAwayScore = fixture.awayScore?.toString() ?? "";

    setHomeScore(nextHomeScore);
    setAwayScore(nextAwayScore);

    setHeadline(resultHeadline(fixture, nextHomeScore, nextAwayScore));
  }

  function selectGraphicType(type: GraphicType) {
    setGraphicType(type);

    if (type === "full-time") {
      if (selectedFixture) {
        setScoresForFixture(selectedFixture);
      }
      return;
    }
    if (selectedFixture?.status === "scheduled") {
      return;
    }
    const nextFixture = upcomingFixtures[0];

    if (!nextFixture) {
      return;
    }
    setFixtureId(nextFixture.id);
    setScoresForFixture(nextFixture);
  }

  function selectFixture(id: string) {
    setFixtureId(id);

    const fixture = fixtures.find((item) => item.id === id);

    if (!fixture) {
      return;
    }
    setScoresForFixture(fixture);
  }

  function updateHomeScore(value: string) {
    setHomeScore(value);

    if (!selectedFixture) {
      return;
    }
    setHeadline(resultHeadline(selectedFixture, value, awayScore));
  }

  function updateAwayScore(value: string) {
    setAwayScore(value);

    if (!selectedFixture) {
      return;
    }
    setHeadline(resultHeadline(selectedFixture, homeScore, value));
  }

  function moveBackgroundUp() {
    setSavedBackgroundId(null);
    setBackgroundPosition((current) => Math.max(0, current - 5));
  }

  function moveBackgroundDown() {
    setSavedBackgroundId(null);
    setBackgroundPosition((current) => Math.min(100, current + 5));
  }

  function zoomBackgroundOut() {
    setSavedBackgroundId(null);
    setBackgroundZoom((current) => Math.max(70, current - 5));
  }

  function zoomBackgroundIn() {
    setSavedBackgroundId(null);
    setBackgroundZoom((current) => Math.min(160, current + 5));
  }

  function saveBackgroundAsDefault() {
    try {
      const existing = getSavedBackgroundSettings();

      const updated: SavedBackgroundSettings = {
        ...existing,
        [selectedBackground.id]: {
          position: backgroundPosition,
          zoom: backgroundZoom,
        },
      };

      window.localStorage.setItem(
        BACKGROUND_SETTINGS_STORAGE_KEY,
        JSON.stringify(updated),
      );

      setSavedBackgroundId(selectedBackground.id);
    } catch (error) {
      console.error("Could not save background settings:", error);
      window.alert("The background settings could not be saved.");
    }
  }

  function resetBackground() {
    const defaults = getBackgroundDefaults(selectedBackground);
    setBackgroundPosition(defaults.position);
    setBackgroundZoom(defaults.zoom);
    setSavedBackgroundId(null);
  }

  async function downloadGraphic() {
    if (!artworkRef.current || !selectedFixture) {
      return;
    }

    try {
      setIsDownloading(true);

      await document.fonts.ready;

      const dataUrl = await toPng(artworkRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        width: 1080,
        height: 1350,
        canvasWidth: 1080,
        canvasHeight: 1350,
        backgroundColor: "#000000",
      });

      const fixtureName =
        `${selectedFixture.homeTeam}-vs-${selectedFixture.awayTeam}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      const typeName =
        graphicType === "next-match" ? "next-match" : "full-time";

      const filename = `hull-hawks-${typeName}-${fixtureName}.png`;

      const link = document.createElement("a");

      link.download = filename;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Could not generate match graphic:", error);

      window.alert("The graphic could not be downloaded. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  const fixtureOptions =
    graphicType === "next-match" ? upcomingFixtures : fullTimeFixtures;

  if (!selectedFixture) {
    return (
      <main className="min-h-screen bg-[var(--black)] px-5 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="sports-text text-3xl font-semibold uppercase">
            No fixtures available
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--black)] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 border-b border-white/10 pb-7">
          <p className="eyebrow text-[var(--red)]">Hull Hawks HC</p>

          <h1 className="sports-text mt-3 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Matchday Graphics
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            Create match graphics using live Hull Hawks fixture data.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
          <section>
            <div className="panel rounded-xl p-5 sm:p-6">
              <div>
                <label className="meta text-white/50">Graphic</label>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-black/30 p-1.5">
                  <button
                    type="button"
                    onClick={() => selectGraphicType("next-match")}
                    className={`sports-text min-h-12 rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-[.08em] transition ${
                      graphicType === "next-match"
                        ? "bg-[var(--red)] text-white"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Next Match
                  </button>

                  <button
                    type="button"
                    onClick={() => selectGraphicType("full-time")}
                    className={`sports-text min-h-12 rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-[.08em] transition ${
                      graphicType === "full-time"
                        ? "bg-[var(--red)] text-white"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Full Time
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="fixture" className="meta text-white/50">
                  Fixture
                </label>

                <select
                  id="fixture"
                  value={selectedFixture.id}
                  onChange={(event) => selectFixture(event.target.value)}
                  className="mt-3 min-h-12 w-full rounded-lg border border-white/15 bg-[#161618] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--red)]"
                >
                  {fixtureOptions.map((fixture) => (
                    <option key={fixture.id} value={fixture.id}>
                      {formatFixtureOption(fixture)}
                    </option>
                  ))}
                </select>
              </div>

              {graphicType === "full-time" && (
                <>
                  <div className="mt-6">
                    <label className="meta text-white/50">Score</label>

                    <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                      <div>
                        <p className="mb-2 truncate text-center text-xs text-white/45">
                          {selectedFixture.homeTeam}
                        </p>

                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={homeScore}
                          onChange={(event) =>
                            updateHomeScore(event.target.value)
                          }
                          className="sports-text h-16 w-full rounded-lg border border-white/15 bg-[#161618] text-center text-3xl font-bold text-white outline-none focus:border-[var(--red)]"
                        />
                      </div>

                      <span className="sports-text mb-4 text-xl text-white/30">
                        —
                      </span>

                      <div>
                        <p className="mb-2 truncate text-center text-xs text-white/45">
                          {selectedFixture.awayTeam}
                        </p>

                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={awayScore}
                          onChange={(event) =>
                            updateAwayScore(event.target.value)
                          }
                          className="sports-text h-16 w-full rounded-lg border border-white/15 bg-[#161618] text-center text-3xl font-bold text-white outline-none focus:border-[var(--red)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="headline" className="meta text-white/50">
                      Headline
                    </label>

                    <input
                      id="headline"
                      type="text"
                      value={headline}
                      onChange={(event) => setHeadline(event.target.value)}
                      placeholder="Optional"
                      className="sports-text mt-3 min-h-12 w-full rounded-lg border border-white/15 bg-[#161618] px-4 py-3 font-semibold uppercase text-white outline-none transition placeholder:text-white/25 focus:border-[var(--red)]"
                    />
                  </div>
                </>
              )}

              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="meta text-white/50">Safe Area</p>

                    <p className="mt-1 text-xs leading-5 text-white/35">
                      Show Instagram-safe content boundaries.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSafeArea((current) => !current)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      showSafeArea ? "bg-[var(--red)]" : "bg-white/15"
                    }`}
                    aria-pressed={showSafeArea}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        showSafeArea ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="meta text-white/50">Background</p>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-black/30 p-1.5">
                  <button
                    type="button"
                    onClick={() => setBackgroundMode("automatic")}
                    className={`sports-text min-h-11 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[.07em] transition ${
                      backgroundMode === "automatic"
                        ? "bg-[var(--red)] text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Automatic
                  </button>

                  <button
                    type="button"
                    onClick={() => setBackgroundMode("manual")}
                    className={`sports-text min-h-11 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[.07em] transition ${
                      backgroundMode === "manual"
                        ? "bg-[var(--red)] text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Choose
                  </button>
                </div>

                {backgroundMode === "automatic" && (
                  <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-sm font-medium text-white/75">
                      {automaticBackground.name}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/35">
                      Selected automatically from the home team.
                    </p>
                  </div>
                )}

                {backgroundMode === "manual" && (
                  <select
                    value={manualBackgroundId}
                    onChange={(event) =>
                      setManualBackgroundId(event.target.value)
                    }
                    className="mt-3 min-h-12 w-full rounded-lg border border-white/15 bg-[#161618] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--red)]"
                  >
                    {MATCH_BACKGROUNDS.map((background) => (
                      <option key={background.id} value={background.id}>
                        {background.location} — {background.name}
                      </option>
                    ))}
                  </select>
                )}

                <div className="mt-5">
                  <p className="meta text-white/35">Position</p>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={moveBackgroundUp}
                      className="sports-text min-h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-semibold uppercase text-white/65 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    >
                      ↑ Up
                    </button>

                    <button
                      type="button"
                      onClick={resetBackground}
                      className="sports-text min-h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-semibold uppercase text-white/65 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={moveBackgroundDown}
                      className="sports-text min-h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-semibold uppercase text-white/65 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    >
                      ↓ Down
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="meta text-white/35">Zoom</p>

                    <p className="text-xs text-white/35">{backgroundZoom}%</p>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={zoomBackgroundOut}
                      className="sports-text min-h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-semibold uppercase text-white/65 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    >
                      − Zoom Out
                    </button>

                    <button
                      type="button"
                      onClick={zoomBackgroundIn}
                      className="sports-text min-h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-semibold uppercase text-white/65 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    >
                      + Zoom In
                    </button>
                  </div>
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <button
                      type="button"
                      onClick={saveBackgroundAsDefault}
                      className={`sports-text min-h-11 w-full rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-[.07em] transition ${
                        savedBackgroundId === selectedBackground.id
                          ? "bg-green-500/15 text-green-300"
                          : "border border-[var(--red)] bg-[var(--red)]/10 text-white hover:bg-[var(--red)]"
                      }`}
                    >
                      {savedBackgroundId === selectedBackground.id
                        ? "✓ Saved as Default"
                        : "Save as Default"}
                    </button>

                    <p className="mt-2 text-center text-xs leading-5 text-white/30">
                      Saves the current position and zoom for this background.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={downloadGraphic}
                disabled={isDownloading}
                className="sports-text mt-6 min-h-12 w-full rounded-lg bg-[var(--red)] px-5 py-3 font-semibold uppercase tracking-[.08em] text-white transition hover:bg-[var(--red-dark)] disabled:cursor-wait disabled:opacity-60"
              >
                {isDownloading ? "Creating PNG..." : "Download PNG"}
              </button>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="meta text-white/45">Live Preview</p>

              <p className="meta text-white/25">1080 × 1350</p>
            </div>

            {/* Visible responsive preview */}
            <div className="mx-auto aspect-[4/5] w-full max-w-[700px]">
              {graphicType === "next-match" ? (
                <NextMatchGraphic
                  fixture={selectedFixture}
                  showSafeArea={showSafeArea}
                  backgroundImage={selectedBackground.image}
                  backgroundPosition={backgroundPosition}
                  backgroundZoom={backgroundZoom}
                />
              ) : (
                <FullTimeGraphic
                  fixture={selectedFixture}
                  homeScore={homeScore}
                  awayScore={awayScore}
                  headline={headline}
                  showSafeArea={showSafeArea}
                  backgroundImage={selectedBackground.image}
                  backgroundPosition={backgroundPosition}
                  backgroundZoom={backgroundZoom}
                />
              )}
            </div>
          </section>
        </div>

        {/* Hidden fixed-size artwork used ONLY for PNG export */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-[-99999px] top-0"
        >
          <div
            ref={artworkRef}
            style={{
              width: "1080px",
              height: "1350px",
            }}
          >
            {graphicType === "next-match" ? (
              <NextMatchGraphic
                fixture={selectedFixture}
                showSafeArea={false}
                backgroundImage={selectedBackground.image}
                backgroundPosition={backgroundPosition}
                backgroundZoom={backgroundZoom}
              />
            ) : (
              <FullTimeGraphic
                fixture={selectedFixture}
                homeScore={homeScore}
                awayScore={awayScore}
                headline={headline}
                showSafeArea={false}
                backgroundImage={selectedBackground.image}
                backgroundPosition={backgroundPosition}
                backgroundZoom={backgroundZoom}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
