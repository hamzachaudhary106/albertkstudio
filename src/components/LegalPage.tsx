import Seo from "./Seo";
import PageHero from "./PageHero";
import ScrollReveal from "./ScrollReveal";
import { legalUpdated } from "../data/content";

type Section = { heading: string; body: string[] };

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Section[];
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function LegalPage({ eyebrow, title, description, sections }: LegalPageProps) {
  return (
    <>
      <Seo title={title} description={description} />
      <PageHero eyebrow={eyebrow} title={title} description={description} />

      <section className="premium-section section-divide bg-white">
        <div className="page-wrap">
          <div className="grid lg:grid-cols-[15rem_1fr] gap-10 lg:gap-16 items-start">
            {/* Sticky table of contents */}
            <aside className="hidden lg:block lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              <p className="curly-label mb-4">On This Page</p>
              <nav>
                <ol className="space-y-2.5 border-l border-curly-border">
                  {sections.map((section, i) => (
                    <li key={section.heading}>
                      <a
                        href={`#${slugify(section.heading)}`}
                        className="block -ml-px border-l border-transparent pl-4 text-[13px] leading-snug text-curly-muted hover:border-curly-accent hover:text-curly-accent-dark transition-colors"
                      >
                        <span className="text-curly-accent-dark/70 mr-2">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div>
              <span className="inline-flex items-center rounded-full border border-curly-border bg-premium-ivory px-3 py-1 text-[11px] tracking-[0.16em] uppercase text-curly-muted mb-10">
                Last updated: {legalUpdated}
              </span>
              <ScrollReveal variant="up">
                <div className="space-y-10 max-w-2xl">
                  {sections.map((section, i) => (
                    <div
                      key={section.heading}
                      id={slugify(section.heading)}
                      className="scroll-mt-[calc(var(--header-height)+1.5rem)]"
                    >
                      <h2 className="font-serif text-2xl mb-3 flex items-baseline gap-3">
                        <span className="text-base text-curly-accent-dark/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {section.heading}
                      </h2>
                      {section.body.map((paragraph, j) => (
                        <p key={j} className="prose-body-sm mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
