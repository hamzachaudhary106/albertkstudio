import { Calendar, Home, Image, Menu, Scissors } from "lucide-react";
import { navLinks } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { useMobileNav } from "../context/MobileNavContext";

const tabs = [
  { id: "#home", label: "Home", icon: Home },
  { id: "#services", label: "Services", icon: Scissors },
  { id: "#gallery", label: "Gallery", icon: Image },
  { id: "#booking", label: "Book", icon: Calendar, primary: true },
] as const;

const sectionIds = ["#home", ...navLinks.map((l) => l.href)];

export default function MobileBottomNav() {
  const activeSection = useActiveSection(sectionIds);
  const { menuOpen, setMenuOpen } = useMobileNav();

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.getElementById(href.replace("#", ""));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 mobile-bottom-nav"
      aria-label="Mobile app navigation"
    >
      <div className="mobile-bottom-nav-inner">
        {tabs.map((tab) => {
          const isActive = activeSection === tab.id;
          const Icon = tab.icon;
          const isPrimary = "primary" in tab && tab.primary;
          const showPrimaryBadge = isPrimary && isActive;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleNav(tab.id)}
              className={`mobile-nav-tab ${isActive ? "mobile-nav-tab-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
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
                  strokeWidth={isActive ? 2 : 1.5}
                  className={showPrimaryBadge ? "text-white" : undefined}
                />
              </span>
              <span className={showPrimaryBadge ? "text-curly-accent-dark font-semibold" : ""}>
                {tab.label}
              </span>
            </button>
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
