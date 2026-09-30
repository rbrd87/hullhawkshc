import SelectionBuilder from "@/components/admin/SelectionBuilder";
import { getHawksData } from "@/lib/hockey";

export const dynamic = "force-dynamic";

export default async function SelectionPage() {
  const data = await getHawksData();

  const fixtures = data.fixtures
    .filter((fixture) => fixture.status === "scheduled")
    .sort((a, b) =>
      `${a.date}T${a.time ?? "23:59"}`.localeCompare(
        `${b.date}T${b.time ?? "23:59"}`,
      ),
    );

  return <SelectionBuilder fixtures={fixtures} />;
}
