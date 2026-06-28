import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

// Shared instance so ScrollToTop (and anchor links) can drive the same
// smooth-scroll engine instead of fighting it with native scrollTo.
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/**
 * Mounts a single Lenis momentum-scroll engine for the public site.
 * Disabled entirely under prefers-reduced-motion (native scroll takes over).
 * Call once, high in the tree (Layout).
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis = instance;

    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis = null;
    };
  }, [reduced]);
}
