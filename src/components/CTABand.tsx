import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { routes } from "../data/content";
import { useContent } from "../cms/ContentProvider";
import ScrollReveal from "./ScrollReveal";

type CTABandProps = {
  title?: string;
  description?: string;
};

/** Reusable closing call-to-action band used at the foot of most pages. */
export default function CTABand({
  title = "Ready for hair you're proud to wear?",
  description = "Request your appointment online or call the studio — we'll confirm your visit within 24 hours.",
}: CTABandProps) {
  const { business } = useContent();
  return (
    <section className="premium-section section-divide bg-premium-dark text-white relative overflow-hidden">
      <div
        className="glow-blob left-1/2 -translate-x-1/2 top-[-6rem] h-72 w-[40rem] opacity-50"
        style={{ background: "radial-gradient(circle, rgba(184,149,110,0.32), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="glow-blob right-[-6rem] bottom-[-6rem] h-72 w-72 opacity-40"
        style={{ background: "radial-gradient(circle, rgba(150,120,79,0.3), transparent 70%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 grain-overlay opacity-[0.1]" aria-hidden />

      <div className="page-wrap relative text-center">
        <ScrollReveal variant="up" duration={0.75}>
          <p className="curly-label-gold mb-5 !text-curly-accent-light">Book Your Visit</p>
          <h2 className="curly-heading-lg text-white max-w-2xl mx-auto mb-6">{title}</h2>
          <div className="divider-diamond mb-7">
            <span aria-hidden />
          </div>
          <p className="text-on-dark text-[15px] leading-[1.75] max-w-xl mx-auto mb-9">
            {description}
          </p>
          <div className="mobile-btn-stack justify-center sm:inline-flex">
            <Link to={routes.book} className="curly-btn-gold btn-luxe group gap-2.5">
              Request Appointment
              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a href={business.phoneHref} className="btn-ghost-gold gap-2.5">
              <Phone size={15} strokeWidth={1.5} />
              {business.phone}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
