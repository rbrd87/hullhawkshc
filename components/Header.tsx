import { BrandMark } from "@/components/BrandMark";
import { FaInstagram } from "react-icons/fa6";

const links = [
  ["Home", "#"],
  ["Fixtures", "#fixtures"],
  ["Table", "#table"],
  ["Team", "#team"],
  ["About", "#about"],
  ["Sponsors", "#sponsors"],
  ["Contact", "#contact"],
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-black/55 backdrop-blur-md">
      <div className="mx-auto flex h-[92px] max-w-[1600px] items-center justify-between px-5 md:px-8 xl:px-12">
        <a
          href="#"
          className="flex items-center gap-4"
          aria-label="Hull Hawks home"
        >
          <BrandMark compact />
          <span className="sports-text hidden text-lg font-semibold uppercase tracking-[0.18em] sm:block">
            Hull Hawks
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href], i) => (
            <a
              key={label}
              href={href}
              className={`sports-text relative py-3 text-[13px] font-semibold uppercase tracking-[0.13em] text-white/75 transition hover:text-white ${
                i === 0
                  ? "after:absolute after:inset-x-0 after:-bottom-[2px] after:h-[2px] after:bg-[var(--red)]"
                  : ""
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/hullhawks/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid h-11 w-11 place-items-center text-xl transition hover:text-[var(--red)]"
          >
            <FaInstagram size={32} />
          </a>

          <a
            href="#support"
            className="sports-text hidden rounded-md bg-[var(--red)] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.10em] transition hover:bg-[var(--red-dark)] sm:block"
          >
            Support us
          </a>
        </div>
      </div>
    </header>
  );
}
