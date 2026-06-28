import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Services from "../components/Services";
import CTABand from "../components/CTABand";
import SectionHeading from "../components/SectionHeading";
import ScrollReveal from "../components/ScrollReveal";
import { pageMeta, routes, serviceMenu, serviceMenuNote } from "../data/content";

export default function ServicesPage() {
  return (
    <>
      <Seo title={pageMeta.services.title} description={pageMeta.services.description} />
      <PageHero
        eyebrow={pageMeta.services.eyebrow}
        title={pageMeta.services.title}
        description={pageMeta.services.description}
      />

      <Services showAllCta={false} />

      <section id="menu" className="premium-section section-divide bg-premium-ivory">
        <div className="page-wrap">
          <SectionHeading
            label="Full Menu"
            title="Services & Pricing"
            description="A complete look at our offerings. Every appointment begins with a complimentary consultation to confirm your exact plan and price."
          />

          <div className="grid lg:grid-cols-2 gap-5 md:gap-8">
            {serviceMenu.map((group) => (
              <ScrollReveal key={group.category} variant="up" className="h-full">
                <div className="h-full border border-curly-border bg-white p-6 md:p-8">
                  <div className="flex items-baseline justify-between gap-3 border-b border-curly-border pb-4 mb-5">
                    <h3 className="font-serif text-2xl">{group.category}</h3>
                  </div>
                  <dl className="space-y-4">
                    {group.items.map((item) => (
                      <div key={item.name} className="flex items-baseline gap-3">
                        <div className="flex-1">
                          <dt className="font-serif text-lg leading-tight">{item.name}</dt>
                          <dd className="text-[13px] text-curly-muted leading-snug mt-0.5">
                            {item.detail}
                          </dd>
                        </div>
                        <span className="shrink-0 text-[11px] tracking-[0.16em] uppercase text-curly-accent-dark font-semibold whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6 pt-5 border-t border-curly-border/70 text-[12px] text-curly-muted leading-relaxed">
                    {group.note}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variant="fade" delay={0.1}>
            <p className="content-narrow text-center text-[12px] text-curly-muted leading-relaxed mt-8 sm:mt-12">
              {serviceMenuNote}
            </p>
            <div className="text-center mt-7 sm:mt-9">
              <Link to={routes.book} className="curly-btn-gold">
                Request Appointment
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CTABand
        title="Not sure which service is right?"
        description="Book a complimentary consultation and we'll build a plan around your hair, goals, and budget."
      />
    </>
  );
}
