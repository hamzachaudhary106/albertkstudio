import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A brief, once-per-session brand reveal shown on first load. Dismisses as soon
 * as fonts are ready (capped at 1.6s) and never blocks for long. Minimal under
 * reduced-motion.
 */
export default function IntroLoader() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("ak.intro");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("ak.intro", "1");

    const min = reduced ? 250 : 850;
    const start = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = performance.now() - start;
      window.setTimeout(() => setShow(false), Math.max(0, min - elapsed));
    };

    const max = window.setTimeout(finish, 1600);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    (fonts?.ready ?? Promise.resolve()).then(finish);

    return () => window.clearTimeout(max);
  }, [show, reduced]);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-premium-dark"
          initial={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: "-100%" }}
          transition={{ duration: reduced ? 0.3 : 0.8, ease: EASE }}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(184,149,110,0.35), transparent 70%)" }}
            aria-hidden
          />
          <motion.div
            className="relative flex flex-col items-center"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="font-serif text-3xl tracking-wide text-white sm:text-4xl">
              Albert <span className="shimmer-gold">K</span> Studio
            </p>
            <div className="divider-diamond mt-4 w-40">
              <span aria-hidden />
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.34em] text-white/45">Aventura · Florida</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
