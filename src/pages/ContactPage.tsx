import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import CTABand from "../components/CTABand";
import ScrollReveal from "../components/ScrollReveal";
import InstagramIcon from "../components/InstagramIcon";
import { business, pageMeta, routes, workingHours } from "../data/content";

export default function ContactPage() {
  return (
    <>
      <Seo title={pageMeta.contact.title} description={pageMeta.contact.description} />
      <PageHero
        eyebrow={pageMeta.contact.eyebrow}
        title={pageMeta.contact.title}
        description={pageMeta.contact.description}
      />

      <section className="premium-section section-divide bg-premium-pearl">
        <div className="page-wrap">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <ScrollReveal variant="left">
              <div>
                <p className="curly-label-gold mb-3">Studio Details</p>
                <h2 className="curly-heading-md mb-6">Come See Us in Aventura</h2>

                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <MapPin size={20} strokeWidth={1.5} className="text-curly-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="curly-label mb-1">Address</p>
                      <p className="prose-body-sm">{business.address}</p>
                      <a
                        href={business.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="curly-link mt-2 !min-h-0 pb-0.5 text-[10px]"
                      >
                        Get Directions
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Phone size={20} strokeWidth={1.5} className="text-curly-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="curly-label mb-1">Phone</p>
                      <a
                        href={business.phoneHref}
                        className="prose-body-sm hover:text-curly-accent-dark transition-colors"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Mail size={20} strokeWidth={1.5} className="text-curly-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="curly-label mb-1">Email</p>
                      <a
                        href={`mailto:${business.email}`}
                        className="prose-body-sm hover:text-curly-accent-dark transition-colors"
                      >
                        {business.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Clock size={20} strokeWidth={1.5} className="text-curly-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="curly-label mb-1">Hours</p>
                      {workingHours.map((item) => (
                        <p key={item.day} className="prose-body-sm">
                          {item.day}: {item.hours}
                        </p>
                      ))}
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <InstagramIcon size={20} className="text-curly-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="curly-label mb-1">Instagram</p>
                      <a
                        href={business.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="prose-body-sm hover:text-curly-accent-dark transition-colors"
                      >
                        {business.instagramHandle}
                      </a>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 pt-8 border-t border-curly-border">
                  <p className="curly-label mb-3">Ready to book?</p>
                  <Link to={routes.book} className="curly-btn-gold w-full sm:w-fit">
                    Request Appointment
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="right" delay={0.1}>
              <ContactForm />
            </ScrollReveal>
          </div>

          <ScrollReveal variant="fade" delay={0.1}>
            <div className="mt-10 sm:mt-14 overflow-hidden border border-curly-border">
              <iframe
                title="Albert K Studio location on Google Maps"
                src={business.mapsEmbedUrl}
                className="w-full h-64 sm:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
