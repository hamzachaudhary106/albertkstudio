import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { business, routes } from "../data/content";

type CTABandProps = {
  title?: string;
  description?: string;
};

/** Reusable closing call-to-action band used at the foot of most pages. */
export default function CTABand({
  title = "Ready for hair you're proud to wear?",
  description = "Request your appointment online or call the studio — we'll confirm your visit within 24 hours.",
}: CTABandProps) {
  return (
    <section className="premium-section section-divide bg-premium-dark text-white">
      <div className="page-wrap text-center">
        <p className="curly-label-gold mb-4 !text-curly-accent-light">Book Your Visit</p>
        <h2 className="curly-heading-lg text-white max-w-2xl mx-auto mb-5">{title}</h2>
        <div className="gold-rule-center mb-6" />
        <p className="text-on-dark text-[15px] leading-[1.75] max-w-xl mx-auto mb-8">
          {description}
        </p>
        <div className="mobile-btn-stack justify-center sm:inline-flex">
          <Link to={routes.book} className="curly-btn-gold">
            Request Appointment
          </Link>
          <a href={business.phoneHref} className="curly-btn-outline-light gap-2.5">
            <Phone size={15} strokeWidth={1.5} />
            {business.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
