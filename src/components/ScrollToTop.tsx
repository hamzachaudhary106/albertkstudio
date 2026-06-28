import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "../hooks/useLenis";

function headerOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
  const px = parseInt(raw, 10);
  return (Number.isFinite(px) ? px : 64) + 12;
}

/**
 * Resets scroll position to the top on route change, while still honoring
 * in-page anchor links (e.g. /services#menu) when a hash is present.
 * Routes through Lenis when smooth scrolling is active to avoid desync.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = getLenis();

    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -headerOffset() });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
