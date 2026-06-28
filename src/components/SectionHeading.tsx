import { motion, useReducedMotion } from "framer-motion";
import KineticText from "./KineticText";

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "center" | "left";
  className?: string;
  animate?: boolean;
  /** Reveal the title word-by-word with a mask animation. */
  kinetic?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SectionHeading({
  label,
  title,
  description,
  light = false,
  align = "center",
  className = "",
  animate = true,
  kinetic = false,
}: SectionHeadingProps) {
  const reduced = useReducedMotion();
  const centered = align === "center";

  const Eyebrow = (
    <span
      className={`inline-flex items-center gap-2.5 ${centered ? "justify-center" : ""}`}
    >
      <span
        className={`h-px w-6 ${light ? "bg-curly-accent-light/80" : "bg-curly-accent/70"}`}
        aria-hidden
      />
      <span
        className={`text-[11px] font-semibold tracking-[0.26em] uppercase ${
          light ? "text-curly-accent-light" : "text-curly-accent-dark"
        }`}
      >
        {label}
      </span>
      <span
        className={`h-px w-6 ${light ? "bg-curly-accent-light/80" : "bg-curly-accent/70"}`}
        aria-hidden
      />
    </span>
  );

  const content = (
    <div
      className={`mb-7 sm:mb-10 md:mb-12 ${
        centered ? "text-center max-w-2xl mx-auto" : "text-left max-w-xl"
      } ${className}`}
    >
      {centered ? (
        <div className="mb-4 flex justify-center">{Eyebrow}</div>
      ) : (
        <div className="mb-4">{Eyebrow}</div>
      )}
      {kinetic ? (
        <KineticText
          as="h2"
          text={title}
          className={`curly-heading-lg ${light ? "text-white" : ""}`}
        />
      ) : (
        <h2 className={`curly-heading-lg ${light ? "text-white" : ""}`}>{title}</h2>
      )}
      <div
        className={`divider-diamond mt-5 ${centered ? "" : "justify-start [&::before]:hidden"}`}
      >
        <span aria-hidden />
      </div>
      {description && (
        <p
          className={`mt-5 ${
            light ? "text-on-dark text-[15px] leading-[1.75]" : "prose-body-sm"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: reduced ? 0.2 : 0.8, ease: EASE }}
    >
      {content}
    </motion.div>
  );
}
