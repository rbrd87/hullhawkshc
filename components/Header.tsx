import { BrandMark } from "@/components/BrandMark";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#" aria-label="Hull Hawks home">
          <BrandMark compact />
        </a>

        <nav className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.12em] sm:gap-6">
          <a href="#fixtures" className="hidden text-white/60 hover:text-white sm:block">Fixtures</a>
          <a href="#table" className="hidden text-white/60 hover:text-white sm:block">Table</a>
          <a
            href="https://www.instagram.com/hullhawks/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-4 py-2 hover:border-[var(--red)] hover:bg-[var(--red)]"
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}
