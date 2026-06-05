import { services } from "../data/content";
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
          description="Every service starts with a consultation. Times and pricing vary by hair length and condition."
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
                    Book This Service
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
