import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { business, navLinks, routes } from "../data/content";
import { useScrollHeader } from "../hooks/useScrollHeader";
import { useMobileNav } from "../context/MobileNavContext";
import BrandLogo from "./BrandLogo";

export default function SiteHeader() {
  const { pathname } = useLocation();
  const scrolled = useScrollHeader();
  const { menuOpen, setMenuOpen } = useMobileNav();
  const shellRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === routes.home;
  // Only the home page has the dark full-bleed hero behind the header.
  const overHero = isHome && !scrolled && !menuOpen;

  const isActive = (href: string) =>
    href === routes.home ? pathname === routes.home : pathname.startsWith(href);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

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
    const active = isActive(href);
    if (overHero) {
      return active ? "text-curly-accent-light" : "text-white/85 hover:text-white";
    }
    return active ? "text-curly-accent-dark" : "text-curly-body hover:text-curly-black";
  };

  const mobileShellClass = overHero ? "mobile-header-shell-hero" : "mobile-header-shell-scrolled";

  return (
    <>
      <header
        ref={shellRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[calc(0.5rem+var(--safe-top))] pb-1 lg:pt-[var(--safe-top)] lg:pb-0 pl-[var(--safe-left)] pr-[var(--safe-right)] ${
          scrolled || !isHome
            ? "lg:bg-premium-pearl/98 lg:backdrop-blur-xl lg:border-b lg:border-curly-border/80 lg:shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            : "lg:bg-transparent lg:border-b lg:border-transparent"
        }`}
      >
        {/* Mobile header */}
        <div className="page-wrap lg:hidden">
          <div className={`mobile-header-shell ${mobileShellClass}`}>
            <Link to={routes.home} className="shrink-0 leading-none min-w-0">
              <BrandLogo variant={overHero ? "hero" : "solid"} />
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <a href={business.phoneHref} className="mobile-header-cta">
                Call Now
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={`mobile-header-icon-btn ${
                  overHero ? "mobile-header-icon-btn-hero" : "mobile-header-icon-btn-solid"
                }`}
                aria-label="Open menu"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div
          className={`page-wrap hidden lg:flex items-center justify-between gap-4 transition-[padding] duration-300 ${
            scrolled || !isHome ? "py-2" : "py-6"
          }`}
        >
          <Link to={routes.home} className="shrink-0 leading-none">
            <BrandLogo variant={overHero ? "hero" : "solid"} />
          </Link>

          <nav className="flex items-center gap-8" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                to={link.href}
                className={`text-[11px] tracking-[0.24em] uppercase transition-colors ${linkClass(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href={business.phoneHref}
              className={`inline-flex min-h-11 items-center gap-2.5 text-sm transition-colors ${
                overHero
                  ? "text-white/90 hover:text-white"
                  : "text-curly-body hover:text-curly-accent-dark"
              }`}
            >
              <Phone size={16} strokeWidth={1.5} className="shrink-0" />
              {business.phone}
            </a>
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`h-11 w-11 inline-flex items-center justify-center transition-colors ${
                overHero
                  ? "text-white/85 hover:text-curly-accent-light"
                  : "text-curly-body hover:text-curly-accent-dark"
              }`}
              aria-label="Albert K Studio on Instagram"
            >
              <InstagramIcon />
            </a>
            <Link to={routes.book} className="curly-btn-gold !min-h-10 !px-5 text-[10px]">
              Book
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`mobile-drawer absolute top-0 right-0 h-full w-full max-w-[21rem] border-l border-curly-border/80 shadow-[-12px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 pt-[var(--safe-top)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="drawer-pad flex items-center justify-between border-b border-curly-border/80 py-4">
            <div>
              <p className="curly-label-gold mb-1">Menu</p>
              <BrandLogo variant="solid" className="!h-10 !max-w-[11rem]" />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="mobile-header-icon-btn mobile-header-icon-btn-solid"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="drawer-pad py-5 flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`mobile-drawer-nav-link ${
                  isActive(link.href)
                    ? "text-curly-accent-dark mobile-drawer-nav-link-active"
                    : "text-curly-body hover:text-curly-accent-dark"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="drawer-pad border-t border-curly-border/80 pt-6 pb-[calc(1.5rem+var(--bottom-nav-height))] space-y-4">
            <a
              href={business.phoneHref}
              className="inline-flex min-h-11 items-center gap-3 prose-body-sm hover:text-curly-accent-dark transition-colors"
            >
              <span className="mobile-header-icon-btn mobile-header-icon-btn-solid !h-9 !w-9">
                <Phone size={16} strokeWidth={1.5} />
              </span>
              {business.phone}
            </a>
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-3 prose-body-sm hover:text-curly-accent-dark transition-colors"
            >
              <span className="mobile-header-icon-btn mobile-header-icon-btn-solid !h-9 !w-9">
                <InstagramIcon size={16} />
              </span>
              {business.instagramHandle}
            </a>
            <Link
              to={routes.book}
              onClick={() => setMenuOpen(false)}
              className="curly-btn-gold w-full"
            >
              Request Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
