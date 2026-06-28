import { MessagesSquare, Gem, ShieldCheck, Hourglass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

const valueIcons: LucideIcon[] = [MessagesSquare, Gem, ShieldCheck, Hourglass];

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
            {aboutValues.map((value, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <StaggerItem key={value.title} variant={i % 2 === 0 ? "left" : "right"}>
                  <div className="card-luxe group h-full bg-premium-pearl p-6 md:p-8">
                    <span className="absolute inset-x-0 top-0 h-px hairline-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                    <span
                      className="num-watermark absolute -right-2 -top-5 text-[5.5rem]"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-premium-champagne text-curly-accent-dark transition-colors duration-300 group-hover:bg-curly-accent group-hover:text-white">
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                    <h3 className="relative font-serif text-xl mb-3">{value.title}</h3>
                    <p className="relative prose-body-sm">{value.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        </div>
      </section>

      <Team />
      <FAQ />
      <CTABand />
    </>
  );
}
