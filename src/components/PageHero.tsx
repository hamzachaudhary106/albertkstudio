import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { routes } from "../data/content";
import { images } from "../data/images";
import SafeImage from "./SafeImage";

type Crumb = { label: string; to?: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  /** Background image for the banner. Defaults to the salon interior. */
  image?: string;
  imagePosition?: string;
};

/**
 * Editorial banner used on every inner page. Sits below the fixed header and
 * provides the title, breadcrumb, and intro with a cinematic image backdrop.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  image = images.hero,
  imagePosition = "object-center",
}: PageHeroProps) {
  return (
    <section className="relative isolate bg-premium-dark text-white overflow-hidden">
      {/* Backdrop image */}
      <SafeImage
        src={image}
        alt=""
        aria-hidden
        loading="eager"
        className={`absolute inset-0 -z-10 w-full h-full object-cover ${imagePosition}`}
      />
      {/* Tonal overlays for legibility + depth */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-premium-dark via-premium-dark/90 to-premium-dark/55"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-premium-dark via-transparent to-premium-dark/40"
        aria-hidden
      />
      {/* Warm accent glow */}
      <div
        className="absolute -z-10 -top-24 -right-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #b8956e 0, transparent 70%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 grain-overlay opacity-[0.18]" aria-hidden />

      <div className="page-wrap relative pt-[calc(var(--header-height)+var(--safe-top)+2.75rem)] pb-12 sm:pt-[calc(var(--header-height)+var(--safe-top)+4.5rem)] sm:pb-16 md:pb-24">
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to={routes.home} className="crumb-pill hover:border-curly-accent-light/60 hover:text-white">
                Home
              </Link>
            </li>
            {(crumbs ?? [{ label: title }]).map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-2">
                <ChevronRight size={13} strokeWidth={1.5} className="text-white/30" />
                {crumb.to ? (
                  <Link to={crumb.to} className="crumb-pill hover:border-curly-accent-light/60 hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="crumb-pill !border-curly-accent/40 !bg-curly-accent/15 !text-curly-accent-light">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="inline-flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-curly-accent-light/80" aria-hidden />
          <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-curly-accent-light">
            {eyebrow}
          </p>
        </div>

        <h1 className="font-serif text-[clamp(2.25rem,6.5vw,4rem)] leading-[1.05] text-white max-w-3xl">
          {title}
        </h1>

        {description && (
          <p className="text-on-dark text-[15px] sm:text-[1.0625rem] leading-[1.75] max-w-2xl mt-5 sm:mt-6">
            {description}
          </p>
        )}
      </div>

      {/* Thin gold base line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-curly-accent/60 to-transparent" aria-hidden />
    </section>
  );
}
