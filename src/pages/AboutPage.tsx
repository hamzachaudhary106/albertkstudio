import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import OurStory from "../components/OurStory";
import Team from "../components/Team";
import FAQ from "../components/FAQ";
import CTABand from "../components/CTABand";
import { StaggerItem, StaggerReveal } from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";
import { aboutValues, pageMeta } from "../data/content";
import { images } from "../data/images";

export default function AboutPage() {
  return (
    <>
      <Seo title={pageMeta.about.title} description={pageMeta.about.description} />
      <PageHero
        eyebrow={pageMeta.about.eyebrow}
        title={pageMeta.about.title}
        description={pageMeta.about.description}
        image={images.gallery.dimensionalBlonde}
        imagePosition="object-[center_30%]"
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
                <div className="lift-card group relative h-full overflow-hidden border border-curly-border bg-premium-pearl p-6 md:p-8">
                  <span
                    className="absolute -right-3 -top-4 font-serif text-[5.5rem] leading-none text-curly-accent/10 select-none transition-colors duration-300 group-hover:text-curly-accent/20"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative inline-block h-px w-10 bg-curly-accent mb-5" aria-hidden />
                  <h3 className="relative font-serif text-xl mb-3">{value.title}</h3>
                  <p className="relative prose-body-sm">{value.description}</p>
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
