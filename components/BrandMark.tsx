export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${compact ? "h-11 w-11" : "h-24 w-24"} overflow-hidden rounded-full bg-white`}
      >
        <img
          src="/images/hull-hawks-logo.png"
          alt="Hull Hawks HC badge"
          className="h-full w-full object-contain"
        />
      </div>
      <div className={compact ? "hidden sm:block" : ""}>
        <div className="font-black tracking-[0.18em]">HULL HAWKS</div>
        {!compact && (
          <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
            Hockey Club
          </div>
        )}
      </div>
    </div>
  );
}
