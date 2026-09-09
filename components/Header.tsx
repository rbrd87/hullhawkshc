import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="text-lg font-black tracking-[0.18em]">
          HULL HAWKS
        </Link>
        <nav className="hidden gap-7 text-sm font-semibold text-white/70 md:flex">
          <a href="#fixtures" className="transition hover:text-white">Fixtures</a>
          <a href="#table" className="transition hover:text-white">Table</a>
          <a href="#about" className="transition hover:text-white">About</a>
        </nav>
      </div>
    </header>
  );
}
