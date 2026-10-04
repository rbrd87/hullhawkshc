import TeamPhotoBuilder from "@/components/admin/TeamPhotoBuilder";
import { getHawksData } from "@/lib/hockey";

export const dynamic = "force-dynamic";

export default async function TeamPhotoPage() {
  const data = await getHawksData();
  const fixtures = [...data.fixtures].sort((a, b) =>
    `${a.date}T${a.time ?? "00:00"}`.localeCompare(`${b.date}T${b.time ?? "00:00"}`)
  );

  return <TeamPhotoBuilder fixtures={fixtures} />;
}
