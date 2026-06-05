import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export type RevealVariant = "left" | "right" | "up" | "down" | "fade" | "scale";

const EASE = [0.22, 1, 0.36, 1] as const;

const VIEWPORT = { once: true, amount: 0.18, margin: "0px 0px -48px 0px" } as const;

function buildVariants(reduced: boolean): Record<RevealVariant, Variants> {
  if (reduced) {
    const fade = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    return { left: fade, right: fade, up: fade, down: fade, fade, scale: fade };
  }

  return {
    left: { hidden: { opacity: 0, x: -56 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 56 }, visible: { opacity: 1, x: 0 } },
    up: { hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -36 }, visible: { opacity: 1, y: 0 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  };
}

type ScrollRevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
};

export default function ScrollReveal({
  children,
  variant = "up",
  delay = 0,
  duration = 0.7,
  className = "",
}: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const variants = buildVariants(!!reduced);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={variants[variant]}
      transition={{ duration: reduced ? 0.2 : duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type StaggerRevealProps = {
  children: ReactNode;
  stagger?: number;
  className?: string;
};

export function StaggerReveal({
  children,
  stagger = 0.12,
  className = "",
}: StaggerRevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
};

export function StaggerItem({
  children,
  variant = "up",
  className = "",
}: StaggerItemProps) {
  const reduced = useReducedMotion();
  const variants = buildVariants(!!reduced);

  return (
    <motion.div
      variants={variants[variant]}
      transition={{ duration: reduced ? 0.2 : 0.65, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
