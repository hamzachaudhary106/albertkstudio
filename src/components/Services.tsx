import { additionalServices, services, servicesSection } from "../data/content";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";

export default function Services() {
  return (
    <section id="services" className="premium-section section-divide bg-white">
      <div className="page-wrap">
        <SectionHeading
          label="Services"
          title="What We Do Best"
          description={servicesSection.description}
        />

        <div className="space-y-6 sm:space-y-10 md:space-y-14 lg:space-y-16">
          {services.map((service, i) => (
            <ScrollReveal
              key={service.id}
              variant={i % 2 === 0 ? "left" : "right"}
              delay={0.05}
              duration={0.75}
            >
              <article
                className={`grid lg:grid-cols-2 mobile-card lg:rounded-none lg:shadow-none ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[5/4] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[26rem] overflow-hidden bg-premium-ivory">
                  <SafeImage
                    src={service.image}
                    alt={`${service.title} at Albert K Studio, Aventura FL`}
                    className={`absolute inset-0 w-full h-full object-cover ${service.imagePosition}`}
                  />
                </div>
                <div className="flex flex-col justify-center card-pad bg-premium-pearl">
                  <p className="curly-label-gold mb-3">{service.tagline}</p>
                  <h3 className="font-serif text-2xl md:text-[1.75rem] mb-4 leading-tight">{service.title}</h3>
                  <div className="flex flex-wrap gap-4 mb-5 text-[11px] tracking-[0.18em] uppercase text-curly-muted">
                    <span>{service.duration}</span>
                    <span className="text-curly-accent-dark font-semibold">{service.priceNote}</span>
                  </div>
                  <p className="prose-body-sm mb-5 sm:mb-8">{service.description}</p>
                  <a href="#booking" className="curly-link w-full sm:w-fit justify-center sm:justify-start">
                    Request This Service
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="fade" delay={0.1}>
          <div className="text-center mt-8 sm:mt-12 md:mt-14">
            <a href="#all-services" className="curly-btn-fill">
              View All Services
            </a>
          </div>
        </ScrollReveal>

        <div id="all-services" className="mt-10 sm:mt-14 md:mt-16 pt-10 sm:pt-14 border-t border-curly-border scroll-mt-[calc(var(--header-height)+1.5rem)]">
          <ScrollReveal variant="up">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <p className="curly-label-gold mb-3">Complete Menu</p>
              <h3 className="font-serif text-2xl md:text-[1.75rem] mb-4 leading-tight">
                {servicesSection.allServicesHeading}
              </h3>
              <p className="prose-body-sm">{servicesSection.allServicesDescription}</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {additionalServices.map((service, i) => (
              <ScrollReveal key={service.title} variant="up" delay={i * 0.04}>
                <article className="h-full rounded-2xl border border-curly-border bg-premium-pearl p-5 sm:p-6">
                  <h4 className="font-serif text-xl mb-2 leading-tight">{service.title}</h4>
                  <p className="prose-body-sm text-curly-muted">{service.note}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variant="fade" delay={0.15}>
            <div className="text-center mt-8 sm:mt-10">
              <a href="#booking" className="curly-link">
                Request Appointment
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
