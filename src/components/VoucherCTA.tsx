import { business } from "../data/content";
import { images } from "../data/images";
import ScrollReveal from "./ScrollReveal";
import SafeImage from "./SafeImage";

export default function VoucherCTA() {
  return (
    <section className="premium-section section-divide bg-premium-ivory">
      <div className="page-wrap">
        <div className="grid lg:grid-cols-2 mobile-card lg:rounded-none lg:shadow-none overflow-hidden">
          <ScrollReveal variant="left" duration={0.75} className="flex flex-col justify-center card-pad lg:py-20">
            <p className="curly-label-gold mb-4">Reserve Your Chair</p>
            <h2 className="curly-heading-lg mb-5">
              Your Best Hair
              <br />
              <em className="text-curly-accent-dark font-normal italic">Starts Here</em>
            </h2>
            <div className="gold-rule mb-6" />
            <p className="prose-body-sm mb-5 sm:mb-8 max-w-md">
              Join {business.reviewCount}+ clients who trust Albert K Studio for color, cuts, and
              styling in Town Center Aventura.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 sm:mb-8 text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] uppercase text-curly-muted">
              <span>{business.googleRating}.0 ★ Google Rating</span>
              <span className="hidden sm:inline text-curly-border">|</span>
              <span>Daily · 10AM to 6PM</span>
            </div>

            <a href="#booking" className="curly-btn-gold w-full sm:w-fit">
              Book Appointment
            </a>

            <p className="mt-6 text-sm text-curly-muted">
              Prefer to speak with us?{" "}
              <a
                href={business.phoneHref}
                className="text-curly-body border-b border-curly-border pb-0.5 transition-colors hover:border-curly-accent hover:text-curly-accent-dark"
              >
                {business.phone}
              </a>
            </p>
          </ScrollReveal>

          <ScrollReveal variant="right" delay={0.12} duration={0.75} className="relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-[28rem]">
            <SafeImage
              src={images.gallery.copperRed}
              alt="Copper red color at Albert K Studio, Aventura Florida"
              className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent lg:bg-gradient-to-l lg:from-black/15 lg:via-transparent lg:to-transparent" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
