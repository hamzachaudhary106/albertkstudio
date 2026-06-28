import { Link, useParams } from "react-router-dom";
import { Check, Clock, Phone, Tag } from "lucide-react";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import CTABand from "../components/CTABand";
import SafeImage from "../components/SafeImage";
import ScrollReveal from "../components/ScrollReveal";
import NotFoundPage from "./NotFoundPage";
import { business, routes, serviceDetailPath, services } from "../data/content";
import { siteUrl } from "../data/seo";
import { setPreferredService } from "../lib/service";

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return <NotFoundPage />;
  }

  const related = services.filter((s) => s.id !== service.id);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    serviceType: service.title,
    url: `${siteUrl}${serviceDetailPath(service.id)}`,
    image: `${siteUrl}${service.image}`,
    provider: { "@id": `${siteUrl}/#salon` },
    areaServed: { "@type": "City", name: "Aventura" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      description: service.priceNote,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Seo title={service.title} description={service.description} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.tagline}
        crumbs={[
          { label: "Services", to: routes.services },
          { label: service.title },
        ]}
      />

      <section className="premium-section section-divide bg-white">
        <div className="page-wrap">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Main content */}
            <div className="lg:col-span-2">
              <ScrollReveal variant="up">
                <SafeImage
                  src={service.image}
                  alt={`${service.title} at Albert K Studio, Aventura FL`}
                  className={`w-full aspect-[16/10] object-cover rounded-2xl md:rounded-none mb-8 sm:mb-10 ${service.imagePosition}`}
                />
              </ScrollReveal>

              <ScrollReveal variant="up" delay={0.05}>
                <p className="curly-label-gold mb-3">Overview</p>
                <h2 className="curly-heading-md mb-5">About {service.title}</h2>
                <div className="gold-rule mb-6" />
                {service.overview.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="prose-body mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </ScrollReveal>

              <ScrollReveal variant="up" delay={0.05}>
                <div className="mt-10 sm:mt-14">
                  <h3 className="font-serif text-2xl mb-5">What's Included</h3>
                  <ul className="space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check
                          size={18}
                          strokeWidth={1.5}
                          className="text-curly-accent-dark shrink-0 mt-1"
                        />
                        <span className="prose-body-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="up" delay={0.05}>
                <div className="mt-10 sm:mt-14">
                  <h3 className="font-serif text-2xl mb-6">What to Expect</h3>
                  <ol className="space-y-6">
                    {service.process.map((step, i) => (
                      <li key={step.title} className="flex gap-5">
                        <span className="shrink-0 font-serif text-3xl text-curly-accent-light/80 leading-none w-10">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="border-b border-curly-border pb-6 last:border-b-0 flex-1">
                          <h4 className="font-serif text-lg mb-1">{step.title}</h4>
                          <p className="prose-body-sm">{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </ScrollReveal>
            </div>

            {/* Sticky sidebar */}
            <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
              <ScrollReveal variant="right" delay={0.1}>
                <div className="premium-card mobile-card lg:rounded-none lg:shadow-none card-pad">
                  <p className="curly-label-gold mb-4">At a Glance</p>

                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <Tag size={18} strokeWidth={1.5} className="text-curly-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="curly-label mb-0.5">Starting Price</p>
                        <p className="font-serif text-xl text-curly-accent-dark">{service.priceNote}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={18} strokeWidth={1.5} className="text-curly-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="curly-label mb-0.5">Typical Duration</p>
                        <p className="prose-body-sm">{service.duration}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-curly-border">
                    <p className="curly-label mb-2">Ideal For</p>
                    <p className="prose-body-sm">{service.idealFor}</p>
                  </div>

                  <div className="mt-7 space-y-3">
                    <Link
                      to={routes.book}
                      onClick={() => setPreferredService(service.id)}
                      className="curly-btn-gold w-full"
                    >
                      Request This Service
                    </Link>
                    <a
                      href={business.phoneHref}
                      className="inline-flex items-center justify-center gap-2 w-full min-h-11 text-[11px] font-medium tracking-[0.24em] uppercase text-curly-body hover:text-curly-accent-dark transition-colors"
                    >
                      <Phone size={14} strokeWidth={1.5} />
                      {business.phone}
                    </a>
                  </div>

                  <p className="text-[11px] text-curly-muted mt-5 leading-relaxed">
                    {business.bookingConfirmNote}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="premium-section section-divide bg-premium-ivory">
        <div className="page-wrap">
          <div className="flex items-end justify-between gap-4 mb-6 sm:mb-10">
            <div>
              <p className="curly-label-gold mb-2">Explore More</p>
              <h2 className="curly-heading-md">Other Services</h2>
            </div>
            <Link to={routes.services} className="curly-link hidden sm:inline-flex shrink-0">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {related.map((item) => (
              <ScrollReveal key={item.id} variant="up" className="h-full">
                <Link
                  to={serviceDetailPath(item.id)}
                  className="group block h-full border border-curly-border bg-white overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-premium-ivory">
                    <SafeImage
                      src={item.image}
                      alt={`${item.title} at Albert K Studio, Aventura FL`}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${item.imagePosition}`}
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-serif text-xl mb-2 group-hover:text-curly-accent-dark transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-curly-muted leading-snug mb-3">{item.tagline}</p>
                    <span className="text-[10px] tracking-[0.18em] uppercase text-curly-accent-dark font-semibold">
                      {item.priceNote}
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
