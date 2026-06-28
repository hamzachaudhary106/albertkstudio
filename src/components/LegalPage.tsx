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

export default function LegalPage({ eyebrow, title, description, sections }: LegalPageProps) {
  return (
    <>
      <Seo title={title} description={description} />
      <PageHero eyebrow={eyebrow} title={title} description={description} />

      <section className="premium-section section-divide bg-white">
        <div className="page-wrap">
          <div className="content-narrow">
            <p className="curly-label mb-10">Last updated: {legalUpdated}</p>
            <ScrollReveal variant="up">
              <div className="space-y-10">
                {sections.map((section) => (
                  <div key={section.heading}>
                    <h2 className="font-serif text-2xl mb-3">{section.heading}</h2>
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="prose-body-sm mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
