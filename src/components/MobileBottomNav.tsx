import { Link, useLocation } from "react-router-dom";
import { Calendar, Home, Image, Menu, Scissors } from "lucide-react";
import { routes } from "../data/content";
import { useMobileNav } from "../context/MobileNavContext";

const tabs = [
  { to: routes.home, label: "Home", icon: Home },
  { to: routes.services, label: "Services", icon: Scissors },
  { to: routes.gallery, label: "Gallery", icon: Image },
  { to: routes.book, label: "Book", icon: Calendar, primary: true },
] as const;

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { menuOpen, setMenuOpen } = useMobileNav();

  const isActive = (to: string) =>
    to === routes.home ? pathname === routes.home : pathname.startsWith(to);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 mobile-bottom-nav"
      aria-label="Mobile app navigation"
    >
      <div className="mobile-bottom-nav-inner">
        {tabs.map((tab) => {
          const active = isActive(tab.to) && !menuOpen;
          const Icon = tab.icon;
          const isPrimary = "primary" in tab && tab.primary;
          const showPrimaryBadge = isPrimary && active;

          return (
            <Link
              key={tab.to}
              to={tab.to}
              onClick={() => setMenuOpen(false)}
              className={`mobile-nav-tab ${active ? "mobile-nav-tab-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={`flex items-center justify-center transition-all duration-200 ${
                  showPrimaryBadge
                    ? "h-9 w-9 rounded-full bg-curly-accent shadow-[0_4px_14px_rgba(184,149,110,0.45)]"
                    : "h-6 w-6"
                }`}
              >
                <Icon
                  size={showPrimaryBadge ? 18 : 22}
                  strokeWidth={active ? 2 : 1.5}
                  className={showPrimaryBadge ? "text-white" : undefined}
                />
              </span>
              <span className={showPrimaryBadge ? "text-curly-accent-dark font-semibold" : ""}>
                {tab.label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`mobile-nav-tab ${menuOpen ? "mobile-nav-tab-active" : ""}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="flex h-6 w-6 items-center justify-center">
            <Menu size={22} strokeWidth={menuOpen ? 2 : 1.5} />
          </span>
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>
    </nav>
  );
}
