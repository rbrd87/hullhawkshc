"use client";

import { toPng } from "html-to-image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Fixture } from "@/types/hockey";
import { displayTeamName, HULL_HAWKS_TEAM } from "@/lib/hockey";

type Position = { x: number; y: number };
type SavedSelection = {
  players: string[];
  starters: Record<string, string>;
  positions: Record<string, Position>;
  bench: string[];
  notes: string;
};

const STORAGE_KEY = "hawks-matchday-selections-v2";
const SLOT_IDS = ["gk","d1","d2","d3","d4","m1","m2","m3","f1","f2","f3"];
const DEFAULT_POSITIONS: Record<string, Position> = {
  gk:{x:50,y:91},
  d1:{x:18,y:73}, d2:{x:50,y:79}, d3:{x:82,y:73}, d4:{x:50,y:58},
  m1:{x:18,y:51}, m2:{x:50,y:45}, m3:{x:82,y:51},
  f1:{x:18,y:24}, f2:{x:50,y:20}, f3:{x:82,y:24},
};

function emptySelection(): SavedSelection {
  return { players: [], starters: {}, positions: { ...DEFAULT_POSITIONS }, bench: [], notes: "" };
}
function opponent(f: Fixture) { return f.homeTeam === HULL_HAWKS_TEAM ? f.awayTeam : f.homeTeam; }
function fixtureLabel(f: Fixture) {
  const date=new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"numeric",month:"short"}).format(new Date(`${f.date}T12:00:00`));
  return `${date} · vs ${displayTeamName(opponent(f))}`;
}

function HockeyPitch({ selection, onMove, onAssign, exportMode=false, homeMatch=false }:{
  selection: SavedSelection; onMove?:(id:string,p:Position)=>void; onAssign?:(id:string,p:string)=>void; exportMode?:boolean; homeMatch?:boolean;
}) {
  const ref=useRef<HTMLDivElement>(null);
  const assigned=useMemo(()=>new Set(Object.values(selection.starters).filter(Boolean)),[selection.starters]);

  function pointerDown(e:React.PointerEvent,id:string){
    if(exportMode||!onMove||!ref.current) return;
    e.preventDefault();
    e.stopPropagation();
    const el=e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const move=(ev:PointerEvent)=>{
      if(!ref.current) return;
      const r=ref.current.getBoundingClientRect();
      onMove(id,{x:Math.max(7,Math.min(93,((ev.clientX-r.left)/r.width)*100)),y:Math.max(6,Math.min(94,((ev.clientY-r.top)/r.height)*100))});
    };
    const up=()=>{ el.removeEventListener("pointermove",move); el.removeEventListener("pointerup",up); };
    el.addEventListener("pointermove",move); el.addEventListener("pointerup",up);
  }

  return <div ref={ref} className="relative aspect-[55/91.4] w-full overflow-hidden rounded-xl border-2 border-white bg-[#167a49] shadow-[inset_0_0_80px_rgba(0,0,0,.18)]">
    {/* Proper outdoor hockey markings: halfway, 23m lines, goals and shooting circles */}
    <div className="absolute inset-[2.5%] border-2 border-white/95"/>
    <div className="absolute left-[2.5%] right-[2.5%] top-1/2 border-t-2 border-white/95"/>
    <div className="absolute left-[2.5%] right-[2.5%] top-[27.5%] border-t-2 border-white/95"/>
    <div className="absolute bottom-[27.5%] left-[2.5%] right-[2.5%] border-t-2 border-white/95"/>
    <div className="absolute left-1/2 top-[2.5%] h-[3%] w-[18%] -translate-x-1/2 border-x-2 border-b-2 border-white bg-[#126b40]"/>
    <div className="absolute bottom-[2.5%] left-1/2 h-[3%] w-[18%] -translate-x-1/2 border-x-2 border-t-2 border-white bg-[#126b40]"/>
    <div className="absolute left-1/2 top-[2.5%] h-[17.5%] w-[54%] -translate-x-1/2 rounded-b-[50%] border-x-2 border-b-2 border-white/95"/>
    <div className="absolute bottom-[2.5%] left-1/2 h-[17.5%] w-[54%] -translate-x-1/2 rounded-t-[50%] border-x-2 border-t-2 border-white/95"/>
    <div className="absolute left-1/2 top-[14%] h-2 w-2 -translate-x-1/2 rounded-full bg-white"/>
    <div className="absolute bottom-[14%] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white"/>

    {SLOT_IDS.map((id,i)=>{
      const p=selection.positions[id]??DEFAULT_POSITIONS[id];
      const player=selection.starters[id]??"";
      return <div key={id} onPointerDown={(e)=>pointerDown(e,id)} className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${exportMode?"w-auto":"w-[25%] min-w-[92px] max-w-[150px] select-none sm:w-[20%]"}`} style={{left:`${p.x}%`,top:`${p.y}%`,touchAction:exportMode?"auto":"none"}}>
        {exportMode ? (
          player && <div className={`sports-text whitespace-nowrap rounded-[7px] border-[3px] border-white px-7 py-3 text-center text-[22px] font-bold uppercase leading-none text-white shadow-lg ${homeMatch?"bg-black":"bg-[var(--red)]"}`}>{player}</div>
        ) : (
          <div className="relative pt-7">
            <div aria-hidden="true" className="absolute left-1/2 top-0 flex h-8 w-14 -translate-x-1/2 items-center justify-center rounded-t-lg border border-b-0 border-white/70 bg-black/80 text-base font-bold text-white">↕</div>
            <select value={player} onPointerDown={(e)=>e.stopPropagation()} onChange={(e)=>onAssign?.(id,e.target.value)} className={`sports-text min-h-11 w-auto min-w-[112px] max-w-[170px] rounded-[7px] border-2 px-4 text-center text-[11px] font-bold uppercase outline-none ${player?`border-white ${homeMatch?"bg-black":"bg-[var(--red)]"} text-white`:"border-white/80 bg-black/75 text-white"}`}>
            <option value="">{i===0?"GK":"POSITION"}</option>
            {selection.players.map((name)=><option key={name} value={name} disabled={assigned.has(name)&&player!==name}>{name}</option>)}
            </select>
          </div>
        )}
      </div>;
    })}
  </div>;
}

export default function SelectionBuilder({fixtures}:{fixtures:Fixture[]}) {
  const [fixtureId,setFixtureId]=useState(fixtures[0]?.id??"general");
  const [selection,setSelection]=useState<SavedSelection>(emptySelection);
  const [newPlayer,setNewPlayer]=useState("");
  const [saved,setSaved]=useState(false);
  const exportRef=useRef<HTMLDivElement>(null);
  const fixture=fixtures.find(f=>f.id===fixtureId);
  const homeMatch=fixture?.homeTeam===HULL_HAWKS_TEAM;

  useEffect(()=>{try{const all=JSON.parse(localStorage.getItem(STORAGE_KEY)??"{}") as Record<string,SavedSelection>;const loaded=all[fixtureId]; setSelection(loaded?{...emptySelection(),...loaded,notes:loaded.notes??""}:emptySelection());}catch{setSelection(emptySelection())}setSaved(false)},[fixtureId]);
  const assigned=useMemo(()=>new Set(Object.values(selection.starters).filter(Boolean)),[selection.starters]);
  const startingCount=assigned.size, selectedCount=startingCount+selection.bench.length;

  function addPlayer(){const n=newPlayer.trim();if(!n||selection.players.some(p=>p.toLowerCase()===n.toLowerCase()))return;setSelection({...selection,players:[...selection.players,n].sort()});setNewPlayer("");setSaved(false)}
  function assign(id:string,player:string){const starters={...selection.starters};Object.entries(starters).forEach(([k,v])=>{if(v===player)delete starters[k]});if(player)starters[id]=player;else delete starters[id];setSelection({...selection,starters,bench:selection.bench.filter(p=>p!==player)});setSaved(false)}
  function move(id:string,p:Position){setSelection(s=>({...s,positions:{...s.positions,[id]:p}}));setSaved(false)}
  function toggleBench(player:string){const on=selection.bench.includes(player);if(!on&&(selection.bench.length>=5||selectedCount>=16))return;setSelection({...selection,bench:on?selection.bench.filter(p=>p!==player):[...selection.bench,player]});setSaved(false)}
  function removePlayer(player:string){setSelection({...selection,players:selection.players.filter(p=>p!==player),starters:Object.fromEntries(Object.entries(selection.starters).filter(([,p])=>p!==player)),bench:selection.bench.filter(p=>p!==player)});setSaved(false)}
  function save(){const all=JSON.parse(localStorage.getItem(STORAGE_KEY)??"{}") as Record<string,SavedSelection>;all[fixtureId]=selection;localStorage.setItem(STORAGE_KEY,JSON.stringify(all));setSaved(true)}
  function resetPositions(){setSelection({...selection,positions:{...DEFAULT_POSITIONS}});setSaved(false)}
  async function download(){if(!exportRef.current)return;const data=await toPng(exportRef.current,{pixelRatio:1,width:1080,height:1440,backgroundColor:"#0d0d0e"});const a=document.createElement("a");a.download=`hull-hawks-selection-${fixture?.date??"squad"}.png`;a.href=data;a.click()}

  return <main className="min-h-screen bg-[var(--black)] text-white"><div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-12">
    <header className="mb-7 border-b border-white/15 pb-6"><Link href="/admin" className="sports-text text-xs font-bold uppercase tracking-[.12em] text-white/60">← Admin</Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow text-[var(--red)]">Matchday</p><h1 className="sports-text mt-1 text-5xl font-bold uppercase sm:text-6xl">Selection</h1><p className="mt-2 text-sm text-white/65">Pick up to 16. Put 11 on the pitch. Move them wherever you want.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:flex"><button onClick={save} className="sports-text min-h-12 rounded-lg border border-white/25 bg-white/10 px-5 font-bold uppercase">{saved?"✓ Saved":"Save"}</button><button onClick={download} className="sports-text min-h-12 rounded-lg bg-[var(--red)] px-5 font-bold uppercase">Download PNG</button></div>
      </div></header>

    <div className="mb-5"><label className="meta text-white/65">Fixture</label><select value={fixtureId} onChange={e=>setFixtureId(e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-white/25 bg-[#1b1b1e] px-4 text-base text-white outline-none focus:border-[var(--red)]">{fixtures.length===0&&<option value="general">General squad</option>}{fixtures.map(f=><option key={f.id} value={f.id}>{fixtureLabel(f)}</option>)}</select></div>

    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.75fr)]">
      <section className="rounded-xl border border-white/15 bg-[#171719] p-3 sm:p-5">
        <div className="mb-4 flex items-center justify-between"><div><p className="meta text-white/55">Starting XI</p><p className="sports-text text-xl font-bold">{startingCount}/11 SELECTED</p></div><button onClick={resetPositions} className="sports-text min-h-11 rounded-lg border border-white/20 px-3 text-xs font-bold uppercase text-white/70">Reset positions</button></div>
        <HockeyPitch selection={selection} onMove={move} onAssign={assign} homeMatch={homeMatch}/>
        <p className="mt-3 text-center text-xs font-medium text-white/60">Drag using the ↕ handle above each player. The pitch stays put while you move them.</p>
        <div className="mt-4 grid gap-4 rounded-lg border border-white/15 bg-black/25 p-4 sm:grid-cols-2"><div><div className="flex justify-between"><p className="sports-text font-bold uppercase">Bench</p><span className="text-sm text-white/60">{selection.bench.length}/5</span></div><div className="mt-3 flex min-h-10 flex-wrap gap-2">{selection.bench.length?selection.bench.map(p=><button key={p} onClick={()=>toggleBench(p)} className="min-h-10 rounded-full border border-[var(--red)] bg-[var(--red)]/20 px-4 text-sm font-semibold">{p} ×</button>):<p className="text-sm text-white/45">No substitutes selected.</p>}</div></div><div><label className="sports-text font-bold uppercase" htmlFor="matchday-notes">Matchday notes</label><textarea id="matchday-notes" value={selection.notes??""} onChange={e=>{setSelection({...selection,notes:e.target.value});setSaved(false)}} rows={5} placeholder="Add drivers, meeting places, kit colours and more..." className="mt-3 w-full resize-y rounded-lg border border-white/20 bg-[#171719] p-3 text-base leading-6 text-white outline-none placeholder:text-white/25 focus:border-[var(--red)]"/></div></div>
      </section>

      <aside className="h-fit rounded-xl border border-white/15 bg-[#171719] p-5"><div className="flex items-end justify-between"><div><p className="meta text-white/55">Players</p><h2 className="sports-text text-2xl font-bold uppercase">Squad</h2></div><span className="sports-text font-bold text-[var(--red)]">{selectedCount}/16</span></div>
        <div className="mt-5 flex gap-2"><input value={newPlayer} onChange={e=>setNewPlayer(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPlayer()} placeholder="Player name" className="min-h-12 min-w-0 flex-1 rounded-lg border border-white/25 bg-black/30 px-3 text-base outline-none focus:border-[var(--red)]"/><button onClick={addPlayer} className="sports-text min-h-12 rounded-lg bg-white/15 px-4 font-bold uppercase">Add</button></div>
        <div className="mt-5 divide-y divide-white/15 border-y border-white/15">{selection.players.length===0?<p className="py-8 text-center text-sm text-white/50">Add players, then select your starting XI on the pitch.</p>:selection.players.map(p=>{const starting=assigned.has(p),benched=selection.bench.includes(p);return <div key={p} className="flex min-h-14 items-center gap-3 py-2"><div className="min-w-0 flex-1"><p className="truncate font-semibold">{p}</p><p className="text-xs text-white/50">{starting?"Starting XI":benched?"Bench":"Not selected"}</p></div>{!starting&&<button disabled={!benched&&(selection.bench.length>=5||selectedCount>=16)} onClick={()=>toggleBench(p)} className={`sports-text min-h-10 rounded-lg px-3 text-xs font-bold uppercase ${benched?"bg-[var(--red)]":"bg-white/10 disabled:opacity-25"}`}>{benched?"Bench ✓":"Bench"}</button>}<button onClick={()=>removePlayer(p)} className="min-h-11 min-w-11 text-xl text-white/45">×</button></div>})}</div>
        <p className="mt-4 text-xs leading-5 text-white/45">Maximum matchday squad: 16 — 11 on the pitch and up to 5 substitutes.</p>
      </aside>
    </div>

    <div className="pointer-events-none fixed left-[-99999px] top-0"><div ref={exportRef} className="box-border flex h-[1440px] w-[1080px] flex-col overflow-hidden bg-[#0d0d0e] px-[64px] py-[54px] text-white">
      <div className="flex items-center gap-6"><img src="/images/hull-hawks-logo.png" alt="" className="h-28 w-28 object-contain"/><div><p className="sports-text text-4xl font-bold uppercase text-[var(--red)]">Hull Hawks HC</p><h2 className="sports-text text-7xl font-bold uppercase">Team Selection</h2></div></div>
      <div className="mt-6 border-y border-white/20 py-4"><p className="sports-text text-4xl font-bold">{fixture?fixtureLabel(fixture):"Matchday Squad"}</p>{fixture&&<p className="mt-2 text-2xl text-white/65">{fixture.venue??"Venue TBC"} · {fixture.time??"TBC"}</p>}</div>
      <div className="mx-auto mt-7 w-[520px] shrink-0"><HockeyPitch selection={selection} exportMode homeMatch={homeMatch}/></div>
      <div className="mt-6 grid shrink-0 grid-cols-2 gap-10"><div><p className="sports-text text-3xl font-bold uppercase text-[var(--red)]">Substitutes</p><div className="mt-3 flex flex-wrap gap-3">{selection.bench.map(p=><span key={p} className="sports-text rounded-full border border-white/30 bg-white/10 px-5 py-3 text-2xl font-bold uppercase">{p}</span>)}{selection.bench.length===0&&<span className="text-[21px] leading-[1.45] text-white/85">None selected</span>}</div></div><div><p className="sports-text text-3xl font-bold uppercase text-[var(--red)]">Matchday Notes</p><p className="mt-3 whitespace-pre-wrap text-[21px] leading-[1.45] text-white/85">{selection.notes?.trim()||"No notes"}</p></div></div>
    </div></div>
  </div></main>;
}
