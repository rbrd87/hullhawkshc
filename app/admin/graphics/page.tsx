import GraphicsGenerator from "@/components/admin/GraphicsGenerator";
import {
  getHawksData,
  HULL_HAWKS_TEAM,
  opponentLogoForHawks,
} from "@/lib/hockey";
import type { Fixture } from "@/types/hockey";

export const dynamic = "force-dynamic";

export type GraphicsFixture = Fixture & {
  homeLogo: string;
  awayLogo: string;
};

function fixtureWithLogos(fixture: Fixture): GraphicsFixture {
  const opponentLogo = opponentLogoForHawks(fixture);

  return {
    ...fixture,

    homeLogo:
      fixture.homeTeam === HULL_HAWKS_TEAM
        ? "/images/hull-hawks-logo.png"
        : (opponentLogo ?? "/images/hull-hawks-logo.png"),

    awayLogo:
      fixture.awayTeam === HULL_HAWKS_TEAM
        ? "/images/hull-hawks-logo.png"
        : (opponentLogo ?? "/images/hull-hawks-logo.png"),
  };
}

export default async function GraphicsPage() {
  const data = await getHawksData();

  const fixtures = [...data.fixtures]
    .sort((a, b) => {
      const aDate = `${a.date}T${a.time ?? "00:00"}`;
      const bDate = `${b.date}T${b.time ?? "00:00"}`;

      return aDate.localeCompare(bDate);
    })
    .map(fixtureWithLogos);

  return <GraphicsGenerator fixtures={fixtures} />;
}
