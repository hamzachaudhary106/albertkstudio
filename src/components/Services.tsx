import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Clock, Tag } from "lucide-react";
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
    <section
      id="services"
      className="premium-section section-divide bg-white relative overflow-hidden"
    >
      <div
        className="glow-blob right-[-10rem] top-1/3 h-96 w-96 opacity-50"
        style={{ background: "radial-gradient(circle, rgba(184,149,110,0.12), transparent 70%)" }}
        aria-hidden
      />
      <div className="page-wrap relative">
        <SectionHeading
          label="Services"
          title="What We Do Best"
          description={servicesSection.description}
        />

        <div className="space-y-6 sm:space-y-10 md:space-y-14 lg:space-y-20">
          {services.map((service, i) => {
            const flipped = i % 2 === 1;
            return (
              <ScrollReveal
                key={service.id}
                variant={flipped ? "right" : "left"}
                delay={0.05}
                duration={0.8}
              >
                <article
                  className={`group relative grid lg:grid-cols-2 mobile-card lg:rounded-none lg:shadow-none lg:bg-transparent ${
                    flipped ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Link
                    to={serviceDetailPath(service.id)}
                    className="relative aspect-[5/4] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[28rem] overflow-hidden bg-premium-ivory"
                    aria-label={`View details for ${service.title}`}
                  >
                    <SafeImage
                      src={service.image}
                      alt={`${service.title} at Albert K Studio, Aventura FL`}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] ${service.imagePosition}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                    <span className="absolute left-5 top-5 pill-luxe-dark">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-white/50">/ {String(services.length).padStart(2, "0")}</span>
                    </span>
                    <span className="absolute bottom-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      <ArrowUpRight size={18} strokeWidth={1.5} />
                    </span>
                  </Link>

                  <div className="relative flex flex-col justify-center card-pad bg-premium-pearl lg:border lg:border-curly-border lg:border-l-0 overflow-hidden">
                    <span
                      className={`hidden lg:block absolute inset-y-0 ${
                        flipped ? "right-0" : "left-0"
                      } w-px hairline-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                      aria-hidden
                    />
                    <span
                      className="num-watermark absolute -top-4 right-3 text-[7rem] hidden sm:block"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <p className="curly-label-gold mb-3 relative">{service.tagline}</p>
                    <h3 className="font-serif text-2xl md:text-[1.85rem] mb-4 leading-tight relative">
                      <Link
                        to={serviceDetailPath(service.id)}
                        className="transition-colors hover:text-curly-accent-dark"
                      >
                        {service.title}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 relative">
                      <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-curly-muted">
                        <Clock size={13} strokeWidth={1.5} className="text-curly-accent" />
                        {service.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-curly-accent-dark font-semibold">
                        <Tag size={13} strokeWidth={1.5} className="text-curly-accent" />
                        {service.priceNote}
                      </span>
                    </div>

                    <p className="prose-body-sm mb-5 sm:mb-8 relative">{service.description}</p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center relative">
                      <Link
                        to={serviceDetailPath(service.id)}
                        className="curly-link w-full sm:w-fit justify-center sm:justify-start"
                      >
                        View Details
                      </Link>
                      <Link
                        to={routes.book}
                        onClick={() => setPreferredService(service.id)}
                        className="group/btn inline-flex items-center justify-center sm:justify-start gap-2 min-h-11 text-[11px] font-semibold tracking-[0.24em] uppercase text-curly-accent-dark transition-colors hover:text-curly-black"
                      >
                        Book
                        <ArrowRight
                          size={14}
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {showAllCta && (
          <ScrollReveal variant="fade" delay={0.1}>
            <div className="text-center mt-10 sm:mt-14 md:mt-16">
              <Link to={servicesSection.allServicesUrl} className="curly-btn-fill group">
                View All Services
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
