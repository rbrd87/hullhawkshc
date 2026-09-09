import { BrandMark } from "@/components/BrandMark";
import {
  HULL_HAWKS_TEAM,
  isHawksHome,
  opponentForHawks,
  resultForHawks,
} from "@/lib/hockey";
import type { Fixture } from "@/types/hockey";
import { FaCalendarDays, FaClock, FaLocationDot } from "react-icons/fa6";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function Team({
  name,
  label,
  hawks = false,
}: {
  name: string;
  label: string;
  hawks?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className="flex h-[76px] items-center justify-center">
        {hawks ? (
          <BrandMark compact />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-full border border-white/15 text-xl font-semibold text-white/28">
            {name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
      </div>

      <p className="sports-text mt-3 line-clamp-2 text-lg font-semibold uppercase tracking-[0.03em]">
        {name}
      </p>
      <p className="meta mt-2 text-white/35">{label}</p>
    </div>
  );
}

export function MatchCard({
  fixture,
  kind,
}: {
  fixture?: Fixture;
  kind: "next" | "result";
}) {
  const title = kind === "next" ? "Next match" : "Latest result";

  if (!fixture) {
    return (
      <article className="panel min-h-[340px] rounded-xl p-6">
        <p className="section-title">{title}</p>
        <p className="mt-16 text-white/35">No match available.</p>
      </article>
    );
  }

  const hawksHome = isHawksHome(fixture);
  const opponent = opponentForHawks(fixture);
  const result = resultForHawks(fixture);
  const hawksScore = hawksHome ? fixture.homeScore : fixture.awayScore;
  const opponentScore = hawksHome ? fixture.awayScore : fixture.homeScore;

  return (
    <article className="panel flex min-h-[340px] flex-col rounded-xl p-6">
      <div className="flex min-h-[44px] items-start justify-between gap-5">
        <p className="section-title">{title}</p>
        <p className="max-w-[150px] text-right text-[10px] font-medium uppercase tracking-[.12em] text-white/42">
          YNE Peak &amp; Wold
          <br />
          Women&apos;s Division 1
        </p>
      </div>

      <div className="mt-6 grid flex-1 grid-cols-[1fr_96px_1fr] items-center gap-3">
        <Team
          name={HULL_HAWKS_TEAM}
          label={hawksHome ? "Home" : "Away"}
          hawks
        />

        <div className="flex h-full min-h-[142px] items-center justify-center">
          {kind === "next" ? (
            <div className="flex items-center gap-3">
              <span className="h-16 w-[2px] bg-[var(--red-dark)]" />
              <span className="sports-text text-2xl font-semibold uppercase">
                VS
              </span>
              <span className="h-16 w-[2px] bg-[var(--red-dark)]" />
            </div>
          ) : (
            <div className="sports-text rounded-md bg-[var(--red)] px-5 py-4 text-center text-4xl font-semibold leading-none shadow-[0_12px_30px_rgba(206,62,68,.18)]">
              {hawksScore ?? "-"} <span className="text-white/55">-</span>{" "}
              {opponentScore ?? "-"}
            </div>
          )}
        </div>

        <Team name={opponent} label={hawksHome ? "Away" : "Home"} />
      </div>

      <div className="mt-6 flex min-h-[88px] items-center border-t border-white/10 text-[15px] text-white/72">
        {kind === "next" ? (
          <div className="grid w-full items-center gap-4 sm:grid-cols-[1.4fr_0.8fr_1.3fr]">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <FaCalendarDays
                className="shrink-0 text-[var(--red-dark)]"
                size={18}
              />
              {dateFormatter.format(new Date(`${fixture.date}T12:00:00`))}
            </span>

            <span className="flex items-center gap-2 whitespace-nowrap">
              <FaClock className="shrink-0 text-[var(--red-dark)]" size={18} />
              {fixture.time ?? "TBC"}
            </span>

            <span className="flex items-center gap-2 whitespace-nowrap">
              <FaLocationDot
                className="shrink-0 text-[var(--red-dark)]"
                size={18}
              />
              {fixture.venue ?? "TBC"}
            </span>
          </div>
        ) : (
          <div className="grid w-full items-center gap-3 sm:grid-cols-[1fr_auto]">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <FaCalendarDays
                className="shrink-0 text-[var(--red-dark)]"
                size={18}
              />

              <span>
                {dateFormatter.format(new Date(`${fixture.date}T12:00:00`))}
                <span className="mx-3 text-white/20">|</span>
                {hawksHome ? "HOME" : "AWAY"}
              </span>
            </div>

            {result && (
              <span className="sports-text rounded-sm bg-[var(--red-dark)]/75 px-7 py-2 text-center text-[12px] font-semibold uppercase tracking-[.14em]">
                {result === "W" ? "Win" : result === "D" ? "Draw" : "Loss"}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
