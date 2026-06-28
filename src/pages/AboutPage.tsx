import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import OurStory from "../components/OurStory";
import Team from "../components/Team";
import FAQ from "../components/FAQ";
import CTABand from "../components/CTABand";
import { StaggerItem, StaggerReveal } from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";
import { aboutValues, pageMeta } from "../data/content";

export default function AboutPage() {
  return (
    <>
      <Seo title={pageMeta.about.title} description={pageMeta.about.description} />
      <PageHero
        eyebrow={pageMeta.about.eyebrow}
        title={pageMeta.about.title}
        description={pageMeta.about.description}
      />

      <OurStory />

      <section className="premium-section section-divide bg-white">
        <div className="page-wrap">
          <SectionHeading
            label="Our Approach"
            title="What Sets Us Apart"
            description="The principles behind every appointment at Albert K Studio."
          />
          <StaggerReveal
            stagger={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
          >
            {aboutValues.map((value, i) => (
              <StaggerItem key={value.title} variant={i % 2 === 0 ? "left" : "right"}>
                <div className="h-full border border-curly-border bg-premium-pearl p-6 md:p-8">
                  <p className="font-serif text-5xl text-curly-accent-light/70 leading-none mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-serif text-xl mb-3">{value.title}</h3>
                  <p className="prose-body-sm">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <Team />
      <FAQ />
      <CTABand />
    </>
  );
}
