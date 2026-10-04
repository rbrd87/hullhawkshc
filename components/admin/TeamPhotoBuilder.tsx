"use client";

import { toPng } from "html-to-image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Fixture } from "@/types/hockey";
import { displayTeamName, HULL_HAWKS_TEAM } from "@/lib/hockey";

type SavedSelection = {
  players?: string[];
  starters?: Record<string, string>;
  bench?: string[];
  notes?: string;
};

const SELECTION_STORAGE_KEY = "hawks-matchday-selections-v2";

function opponent(f: Fixture) {
  return f.homeTeam === HULL_HAWKS_TEAM ? f.awayTeam : f.homeTeam;
}

function fixtureLabel(f: Fixture) {
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" })
    .format(new Date(`${f.date}T12:00:00`));
  return `${date} · vs ${displayTeamName(opponent(f))}${f.isCup ? " · CUP" : ""}`;
}

function graphicDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" })
    .format(new Date(`${date}T12:00:00`))
    .toUpperCase();
}

export default function TeamPhotoBuilder({ fixtures }: { fixtures: Fixture[] }) {
  const exportRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fixtureId, setFixtureId] = useState(fixtures[0]?.id ?? "");
  const [photo, setPhoto] = useState<string>("");
  const [photoX, setPhotoX] = useState(50);
  const [photoY, setPhotoY] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [panelSide, setPanelSide] = useState<"left" | "right">("left");
  const [squadText, setSquadText] = useState("");
  const [subsText, setSubsText] = useState("");
  const [downloading, setDownloading] = useState(false);

  const fixture = fixtures.find((f) => f.id === fixtureId) ?? fixtures[0];

  useEffect(() => {
    if (!fixture) return;
    try {
      const all = JSON.parse(localStorage.getItem(SELECTION_STORAGE_KEY) ?? "{}") as Record<string, SavedSelection>;
      const saved = all[fixture.id];
      if (!saved) {
        setSquadText("");
        setSubsText("");
        return;
      }
      const starters = Object.values(saved.starters ?? {}).filter(Boolean);
      setSquadText(starters.join("\n"));
      setSubsText((saved.bench ?? []).join("\n"));
    } catch {
      setSquadText("");
      setSubsText("");
    }
  }, [fixture?.id]);

  const squad = useMemo(() => squadText.split("\n").map((n) => n.trim()).filter(Boolean), [squadText]);
  const subs = useMemo(() => subsText.split("\n").map((n) => n.trim()).filter(Boolean), [subsText]);

  function uploadPhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result ?? ""));
      setPhotoX(50);
      setPhotoY(50);
      setZoom(100);
    };
    reader.readAsDataURL(file);
  }

  async function download() {
    if (!exportRef.current || !photo) return;
    setDownloading(true);
    try {
      const data = await toPng(exportRef.current, {
        pixelRatio: 1,
        width: 1080,
        height: 1440,
        canvasWidth: 1080,
        canvasHeight: 1440,
        backgroundColor: "#0d0d0e",
      });
      const a = document.createElement("a");
      a.href = data;
      a.download = `hull-hawks-team-photo-${fixture?.date ?? "matchday"}.png`;
      a.click();
    } finally {
      setDownloading(false);
    }
  }

  if (!fixture) {
    return <main className="min-h-screen bg-[var(--black)] p-8 text-white">No fixtures available.</main>;
  }

  const hawksHome = fixture.homeTeam === HULL_HAWKS_TEAM;
  const opponentName = displayTeamName(opponent(fixture));

  return (
    <main className="min-h-screen bg-[var(--black)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-7 border-b border-white/15 pb-6">
          <Link href="/admin" className="sports-text text-xs font-bold uppercase tracking-[.12em] text-white/60">← Admin</Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--red)]">Matchday</p>
              <h1 className="sports-text mt-1 text-5xl font-bold uppercase sm:text-6xl">Team Photo</h1>
              <p className="mt-2 max-w-xl text-sm text-white/65">Upload the photo, load the saved selection, position it and download the matchday squad graphic.</p>
            </div>
            <button onClick={download} disabled={!photo || downloading} className="sports-text min-h-12 rounded-lg bg-[var(--red)] px-6 font-bold uppercase disabled:opacity-35">
              {downloading ? "Creating..." : "Download PNG"}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-5 rounded-xl border border-white/15 bg-[#171719] p-5">
            <div><label className="meta text-white/65">Fixture</label><select value={fixture.id} onChange={(e) => setFixtureId(e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-white/25 bg-[#1b1b1e] px-3 text-base outline-none focus:border-[var(--red)]">{fixtures.map((f) => <option key={f.id} value={f.id}>{fixtureLabel(f)}</option>)}</select></div>

            <div><p className="meta text-white/65">Team photo</p><input ref={fileRef} type="file" accept="image/*" onChange={(e) => uploadPhoto(e.target.files?.[0])} className="hidden"/><button onClick={() => fileRef.current?.click()} className="sports-text mt-2 min-h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 font-bold uppercase">{photo ? "Change photo" : "Upload photo"}</button></div>

            <div><p className="meta text-white/65">Side panel</p><div className="mt-2 grid grid-cols-2 gap-2">{(["left","right"] as const).map((side) => <button key={side} onClick={() => setPanelSide(side)} className={`sports-text min-h-11 rounded-lg border px-4 font-bold uppercase ${panelSide === side ? "border-[var(--red)] bg-[var(--red)]" : "border-white/20 bg-white/5"}`}>{side}</button>)}</div></div>

            <div className="space-y-4 border-t border-white/10 pt-5">
              <label className="block text-sm text-white/70">Photo zoom <span className="float-right">{zoom}%</span><input type="range" min="100" max="180" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-2 w-full accent-[var(--red)]"/></label>
              <label className="block text-sm text-white/70">Photo left / right<input type="range" min="0" max="100" value={photoX} onChange={(e) => setPhotoX(Number(e.target.value))} className="mt-2 w-full accent-[var(--red)]"/></label>
              <label className="block text-sm text-white/70">Photo up / down<input type="range" min="0" max="100" value={photoY} onChange={(e) => setPhotoY(Number(e.target.value))} className="mt-2 w-full accent-[var(--red)]"/></label>
            </div>

            <div className="border-t border-white/10 pt-5"><label className="meta text-white/65">Squad — one name per line</label><textarea rows={8} value={squadText} onChange={(e) => setSquadText(e.target.value)} placeholder="Loads from saved Selection when available" className="mt-2 w-full resize-y rounded-lg border border-white/20 bg-black/25 p-3 text-base leading-6 outline-none focus:border-[var(--red)]"/></div>
            <div><label className="meta text-white/65">Substitutes</label><textarea rows={4} value={subsText} onChange={(e) => setSubsText(e.target.value)} placeholder="One name per line" className="mt-2 w-full resize-y rounded-lg border border-white/20 bg-black/25 p-3 text-base leading-6 outline-none focus:border-[var(--red)]"/></div>
          </aside>

          <section className="min-w-0">
            <div className="mx-auto aspect-[3/4] w-full max-w-[650px] overflow-hidden rounded-xl border border-white/15 bg-[#111]">
              <div className="h-full w-full origin-top-left scale-[.602] sm:scale-[.602]">
                <Graphic fixture={fixture} photo={photo} photoX={photoX} photoY={photoY} zoom={zoom} panelSide={panelSide} squad={squad} subs={subs} hawksHome={hawksHome} opponentName={opponentName}/>
              </div>
            </div>
          </section>
        </div>

        <div className="pointer-events-none fixed left-[-99999px] top-0">
          <div ref={exportRef}><Graphic fixture={fixture} photo={photo} photoX={photoX} photoY={photoY} zoom={zoom} panelSide={panelSide} squad={squad} subs={subs} hawksHome={hawksHome} opponentName={opponentName}/></div>
        </div>
      </div>
    </main>
  );
}

function Graphic({ fixture, photo, photoX, photoY, zoom, panelSide, squad, subs, hawksHome, opponentName }:{
  fixture: Fixture; photo:string; photoX:number; photoY:number; zoom:number; panelSide:"left"|"right"; squad:string[]; subs:string[]; hawksHome:boolean; opponentName:string;
}) {
  const panel = (
    <div className="relative z-10 flex h-full w-[350px] shrink-0 flex-col overflow-hidden bg-[#0b0b0c] px-10 py-12 text-white">
      <div className="absolute inset-y-0 right-0 w-2 bg-[var(--red)]"/>
      <div className="absolute -left-24 bottom-[-70px] h-72 w-72 rotate-[-14deg] rounded-full border-[34px] border-[var(--red)]/10"/>
      <img src="/images/hull-hawks-logo.png" alt="" className="h-28 w-28 object-contain"/>
      <p className="sports-text mt-4 text-[31px] font-bold uppercase text-[var(--red)]">Hull Hawks HC</p>
      <h2 className="sports-text mt-1 text-[58px] font-bold uppercase leading-[.82]">Matchday<br/>Squad</h2>
      <div className="mt-8 h-2 w-28 bg-[var(--red)]"/>

      <div className="mt-8 min-h-0 flex-1">
        <p className="sports-text text-[30px] font-bold uppercase text-[var(--red)]">Squad</p>
        <div className="mt-3 space-y-1">{squad.map((name,i) => <p key={`${name}-${i}`} className="sports-text text-[25px] font-semibold uppercase leading-[1.08]"><span className="mr-4 inline-block w-6 text-right text-[var(--red)]">{i+1}</span>{name}</p>)}</div>
        {subs.length > 0 && <><div className="my-5 h-px bg-white/30"/><p className="sports-text text-[27px] font-bold uppercase text-[var(--red)]">Substitutes</p><div className="mt-2 space-y-1">{subs.map((name,i) => <p key={`${name}-sub-${i}`} className="sports-text text-[24px] font-semibold uppercase"><span className="mr-4 inline-block w-6 text-right text-[var(--red)]">{squad.length+i+1}</span>{name}</p>)}</div></>}
      </div>

      <div className="relative mt-6 border-t border-white/25 pt-6">
        <p className="sports-text text-[27px] font-bold uppercase leading-tight">Hull Hawks 1</p>
        <p className="sports-text my-1 text-[32px] font-bold uppercase text-[var(--red)]">VS</p>
        <p className="sports-text text-[27px] font-bold uppercase leading-tight">{opponentName}</p>
        <p className="sports-text mt-5 text-[20px] font-semibold uppercase leading-tight text-white/70">{fixture.competitionName}</p>
        <p className="sports-text mt-4 text-[22px] font-semibold uppercase">{graphicDate(fixture.date)} · {fixture.time ?? "TBC"}</p>
        <p className="mt-2 text-[18px] leading-tight text-white/60">{fixture.venue ?? "Venue TBC"}</p>
      </div>
    </div>
  );

  return <div className="flex h-[1440px] w-[1080px] overflow-hidden bg-black">
    {panelSide === "left" && panel}
    <div className="relative h-full min-w-0 flex-1 overflow-hidden bg-[#171719]">
      {photo ? <img src={photo} alt="" className="absolute left-1/2 top-1/2 h-full w-full object-cover" style={{objectPosition:`${photoX}% ${photoY}%`,transform:`translate(-50%,-50%) scale(${zoom/100})`}}/> : <div className="flex h-full items-center justify-center px-16 text-center"><p className="sports-text text-5xl font-bold uppercase text-white/20">Upload your team photo</p></div>}
      <div className={`absolute inset-y-0 w-32 ${panelSide==="left"?"left-0 bg-gradient-to-r":"right-0 bg-gradient-to-l"} from-black/45 to-transparent`}/>
    </div>
    {panelSide === "right" && <div className="[&>div]:!left-0 [&>div]:!right-auto">{panel}</div>}
  </div>;
}
