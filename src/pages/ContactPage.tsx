import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import CTABand from "../components/CTABand";
import ScrollReveal from "../components/ScrollReveal";
import InstagramIcon from "../components/InstagramIcon";
import { pageMeta, routes } from "../data/content";
import { useContent } from "../cms/ContentProvider";

export default function ContactPage() {
  const { business, workingHours } = useContent();
  return (
    <>
      <Seo title={pageMeta.contact.title} description={pageMeta.contact.description} />
      <PageHero
        eyebrow={pageMeta.contact.eyebrow}
        title={pageMeta.contact.title}
        description={pageMeta.contact.description}
      />

      <section className="premium-section section-divide bg-premium-pearl relative overflow-hidden">
        <div
          className="glow-blob -left-24 top-0 h-80 w-80 opacity-50"
          style={{ background: "radial-gradient(circle, rgba(184,149,110,0.13), transparent 70%)" }}
          aria-hidden
        />
        <div className="page-wrap relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <ScrollReveal variant="left">
              <div>
                <p className="curly-label-gold mb-3">Studio Details</p>
                <h2 className="curly-heading-md mb-6">Come See Us in Aventura</h2>

                <ul className="border border-curly-border bg-white divide-y divide-curly-border">
                  <li className="flex gap-4 p-5">
                    <span className="stat-chip shrink-0">
                      <MapPin size={18} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
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
                  <li className="flex gap-4 p-5">
                    <span className="stat-chip shrink-0">
                      <Phone size={18} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="curly-label mb-1">Phone</p>
                      <a
                        href={business.phoneHref}
                        className="prose-body-sm hover:text-curly-accent-dark transition-colors"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4 p-5">
                    <span className="stat-chip shrink-0">
                      <Mail size={18} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="curly-label mb-1">Email</p>
                      <a
                        href={`mailto:${business.email}`}
                        className="prose-body-sm break-words hover:text-curly-accent-dark transition-colors"
                      >
                        {business.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4 p-5">
                    <span className="stat-chip shrink-0">
                      <Clock size={18} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="curly-label mb-1">Hours</p>
                      {workingHours.map((item) => (
                        <p key={item.day} className="prose-body-sm">
                          {item.day}: {item.hours}
                        </p>
                      ))}
                    </div>
                  </li>
                  <li className="flex gap-4 p-5">
                    <span className="stat-chip shrink-0">
                      <InstagramIcon size={18} />
                    </span>
                    <div className="min-w-0">
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
                  <Link to={routes.book} className="curly-btn-gold btn-luxe w-full sm:w-fit">
                    Request Appointment
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="right" delay={0.1}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
