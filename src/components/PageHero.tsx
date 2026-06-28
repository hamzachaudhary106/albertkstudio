import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { routes } from "../data/content";

type Crumb = { label: string; to?: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
};

/**
 * Top banner used on every inner page. Sits below the fixed header and
 * provides the title, breadcrumb, and intro for the page.
 */
export default function PageHero({ eyebrow, title, description, crumbs }: PageHeroProps) {
  return (
    <section className="relative bg-premium-dark text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #d4bc8e 0, transparent 45%), radial-gradient(circle at 85% 60%, #b8956e 0, transparent 40%)",
        }}
        aria-hidden
      />
      <div className="page-wrap relative pt-[calc(var(--header-height)+var(--safe-top)+2.5rem)] pb-10 sm:pt-[calc(var(--header-height)+var(--safe-top)+4rem)] sm:pb-14 md:pb-20">
        <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
          <ol className="flex flex-wrap items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-white/55">
            <li>
              <Link to={routes.home} className="hover:text-curly-accent-light transition-colors">
                Home
              </Link>
            </li>
            {(crumbs ?? [{ label: title }]).map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight size={12} strokeWidth={1.5} className="text-white/35" />
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-curly-accent-light transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-curly-accent-light">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="curly-label-gold mb-3 !text-curly-accent-light">{eyebrow}</p>
        <h1 className="font-serif text-[clamp(2rem,6vw,3.5rem)] leading-[1.08] text-white max-w-3xl">
          {title}
        </h1>
        <div className="gold-rule mt-5 mb-5" />
        {description && (
          <p className="text-on-dark text-[15px] sm:text-base leading-[1.75] max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
