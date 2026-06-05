import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { business, navLinks } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrollHeader } from "../hooks/useScrollHeader";
import { useMobileNav } from "../context/MobileNavContext";
import BrandLogo from "./BrandLogo";

const sectionIds = ["#home", ...navLinks.map((l) => l.href)];

export default function SiteHeader() {
  const scrolled = useScrollHeader();
  const activeSection = useActiveSection(sectionIds);
  const { menuOpen, setMenuOpen } = useMobileNav();
  const shellRef = useRef<HTMLDivElement>(null);
  const overHero = !scrolled && !menuOpen;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const updateOffset = () => {
      if (shellRef.current) {
        document.documentElement.style.setProperty(
          "--header-height",
          `${shellRef.current.offsetHeight}px`
        );
      }
    };
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    if (shellRef.current) observer.observe(shellRef.current);
    window.addEventListener("resize", updateOffset);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, [scrolled, menuOpen]);

  const linkClass = (href: string) => {
    const isActive = activeSection === href;
    if (overHero) {
      return isActive ? "text-curly-accent-light" : "text-white/85 hover:text-white";
    }
    return isActive ? "text-curly-accent-dark" : "text-curly-body hover:text-curly-black";
  };

  return (
    <>
      <header
        ref={shellRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[var(--safe-top)] ${
          scrolled
            ? "bg-premium-pearl/98 backdrop-blur-xl border-b border-curly-border/80 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div
          className={`page-wrap flex items-center justify-between gap-4 transition-[padding] duration-300 ${
            scrolled ? "py-2 md:py-2" : "py-3 md:py-6"
          }`}
        >
          <a href="#home" className="shrink-0 leading-none">
            <BrandLogo variant={overHero ? "hero" : "solid"} />
          </a>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className={`text-[11px] tracking-[0.24em] uppercase transition-colors ${linkClass(link.href)}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex h-11 w-11 items-center justify-center transition-colors ${
                overHero
                  ? "text-white/85 hover:text-curly-accent-light"
                  : "text-curly-body hover:text-curly-accent-dark"
              }`}
              aria-label="Albert K Studio on Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="#booking"
              className="curly-btn-gold hidden sm:inline-flex !min-h-10 !px-5 text-[10px]"
            >
              Book
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`lg:hidden h-11 w-11 inline-flex items-center justify-center transition-colors ${
                overHero ? "text-white/90" : "text-curly-black"
              }`}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-[20rem] bg-premium-pearl border-l border-curly-border transition-transform duration-300 pt-[var(--safe-top)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="drawer-pad flex items-center justify-between border-b border-curly-border py-3">
            <BrandLogo variant="solid" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="h-11 w-11 inline-flex items-center justify-center"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="drawer-pad py-6 flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`min-h-12 flex items-center font-serif text-2xl leading-tight transition-colors ${
                  activeSection === link.href ? "text-curly-accent-dark" : "hover:text-curly-accent"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="drawer-pad border-t border-curly-border pt-6 pb-[calc(1.5rem+var(--bottom-nav-height))] space-y-4">
            <a
              href={business.phoneHref}
              className="block min-h-11 flex items-center prose-body-sm hover:text-curly-accent transition-colors"
            >
              {business.phone}
            </a>
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 prose-body-sm hover:text-curly-accent transition-colors"
            >
              <InstagramIcon size={16} />
              Instagram
            </a>
            <a
              href="#booking"
              onClick={() => setMenuOpen(false)}
              className="curly-btn-gold w-full"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
