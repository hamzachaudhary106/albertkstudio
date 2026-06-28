import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { routes, serviceDetailPath, servicesSection } from "../data/content";
import { useContent } from "../cms/ContentProvider";
import { setPreferredService } from "../lib/service";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";

type ServicesProps = {
  /** Show the "View All Services" button. Hidden on the dedicated Services page. */
  showAllCta?: boolean;
};

export default function Services({ showAllCta = true }: ServicesProps) {
  const { services } = useContent();
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
                <Link
                  to={serviceDetailPath(service.id)}
                  className="group relative aspect-[5/4] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[26rem] overflow-hidden bg-premium-ivory"
                  aria-label={`View details for ${service.title}`}
                >
                  <SafeImage
                    src={service.image}
                    alt={`${service.title} at Albert K Studio, Aventura FL`}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${service.imagePosition}`}
                  />
                </Link>
                <div className="flex flex-col justify-center card-pad bg-premium-pearl">
                  <p className="curly-label-gold mb-3">{service.tagline}</p>
                  <h3 className="font-serif text-2xl md:text-[1.75rem] mb-4 leading-tight">
                    <Link
                      to={serviceDetailPath(service.id)}
                      className="hover:text-curly-accent-dark transition-colors"
                    >
                      {service.title}
                    </Link>
                  </h3>
                  <div className="flex flex-wrap gap-4 mb-5 text-[11px] tracking-[0.18em] uppercase text-curly-muted">
                    <span>{service.duration}</span>
                    <span className="text-curly-accent-dark font-semibold">{service.priceNote}</span>
                  </div>
                  <p className="prose-body-sm mb-5 sm:mb-8">{service.description}</p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 sm:items-center">
                    <Link
                      to={serviceDetailPath(service.id)}
                      className="curly-link w-full sm:w-fit justify-center sm:justify-start"
                    >
                      View Details
                    </Link>
                    <Link
                      to={routes.book}
                      onClick={() => setPreferredService(service.id)}
                      className="inline-flex items-center justify-center sm:justify-start gap-2 min-h-11 text-[11px] font-medium tracking-[0.24em] uppercase text-curly-accent-dark hover:text-curly-black transition-colors"
                    >
                      Book
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {showAllCta && (
          <ScrollReveal variant="fade" delay={0.1}>
            <div className="text-center mt-8 sm:mt-12 md:mt-14">
              <Link to={servicesSection.allServicesUrl} className="curly-btn-fill">
                View All Services
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
