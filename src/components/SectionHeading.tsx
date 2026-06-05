import ScrollReveal from "./ScrollReveal";

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "center" | "left";
  className?: string;
  animate?: boolean;
};

export default function SectionHeading({
  label,
  title,
  description,
  light = false,
  align = "center",
  className = "",
  animate = true,
}: SectionHeadingProps) {
  const content = (
    <div
      className={`mb-12 ${align === "center" ? "text-center max-w-2xl mx-auto" : "text-left max-w-xl"} ${className}`}
    >
      <p className={`curly-label-gold mb-3 ${light ? "!text-curly-accent-light" : ""}`}>{label}</p>
      <h2 className={`curly-heading-lg mb-4 ${light ? "text-white" : ""}`}>{title}</h2>
      <div className={align === "center" ? "gold-rule-center mb-5" : "gold-rule mb-5"} />
      {description && (
        <p className={light ? "text-on-dark text-[15px] leading-[1.75]" : "prose-body-sm"}>
          {description}
        </p>
      )}
    </div>
  );

  if (!animate) return content;

  return (
    <ScrollReveal variant="up" duration={0.75}>
      {content}
    </ScrollReveal>
  );
}
