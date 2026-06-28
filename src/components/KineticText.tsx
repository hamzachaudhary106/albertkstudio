import { Fragment, useMemo, type ElementType } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type KineticTextProps = {
  text: string;
  /** Element to render as the container (e.g. "h2", "span"). */
  as?: ElementType;
  className?: string;
  /** Per-word stagger in seconds. */
  stagger?: number;
  delay?: number;
  /** Trigger on scroll-into-view (default) or immediately on mount. */
  trigger?: "inView" | "mount";
};

/**
 * Luxury "mask reveal" — each word rises from behind a clipped line.
 * Falls back to a simple fade when the user prefers reduced motion.
 */
export default function KineticText({
  text,
  as = "span",
  className = "",
  stagger = 0.06,
  delay = 0,
  trigger = "inView",
}: KineticTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = useMemo(() => motion.create(as), [as]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
  };
  const word: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : { hidden: { y: "115%" }, show: { y: "0%", transition: { duration: 0.8, ease: EASE } } };

  const animateProps =
    trigger === "mount"
      ? { animate: "show" as const }
      : { whileInView: "show" as const, viewport: { once: true, amount: 0.5 } };

  return (
    <MotionTag className={className} variants={container} initial="hidden" {...animateProps}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span variants={word} className="inline-block will-change-transform">
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </MotionTag>
  );
}
