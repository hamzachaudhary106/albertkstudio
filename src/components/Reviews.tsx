import { BadgeCheck, Quote, Star } from "lucide-react";
import { reviewsSection } from "../data/content";
import { useContent, type SiteContent } from "../cms/ContentProvider";
import ScrollReveal, { StaggerItem, StaggerReveal } from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} strokeWidth={1.5} className="fill-curly-accent-light text-curly-accent-light" />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: SiteContent["reviews"][number] }) {
  return (
    <blockquote className="card-glass flex h-full flex-col p-5 sm:p-6 md:p-8">
      <Quote
        size={30}
        strokeWidth={1}
        className="absolute right-5 top-5 text-curly-accent/25"
        aria-hidden
      />
      <Stars className="mb-4 shrink-0" />
      <p className="text-white/90 text-[15px] leading-[1.7] italic mb-5 sm:mb-6 flex-1 relative">
        &ldquo;{review.text}&rdquo;
      </p>
      <footer className="pt-4 border-t border-white/10 mt-auto shrink-0 flex items-center justify-between gap-3">
        <div>
          <p className="font-serif text-base text-white">{review.name}</p>
          <p className="text-[11px] tracking-[0.18em] uppercase text-white/55 mt-1">
            {review.date}
          </p>
        </div>
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase text-curly-accent-light/90">
            <BadgeCheck size={14} strokeWidth={1.75} />
            Verified
          </span>
        )}
      </footer>
    </blockquote>
  );
}

export default function Reviews() {
  const { business, featuredReview, reviews } = useContent();
  return (
    <section
      id="reviews"
      className="premium-section section-divide bg-premium-dark text-white relative overflow-hidden"
    >
      <div
        className="glow-blob right-[-8rem] top-10 h-80 w-80 opacity-40"
        style={{ background: "radial-gradient(circle, rgba(184,149,110,0.3), transparent 70%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 grain-overlay opacity-[0.1]" aria-hidden />
      <div className="page-wrap relative">
        <SectionHeading
          kinetic
          label="Reviews"
          title={reviewsSection.heading}
          description={reviewsSection.description}
          light
        />

        {/* Rating summary bar */}
        <ScrollReveal variant="up" duration={0.7}>
          <div className="mx-auto mb-8 sm:mb-12 flex max-w-md flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="font-serif text-4xl text-gold-gradient-light leading-none">
                {business.googleRating.toFixed(1)}
              </span>
              <div className="text-left">
                <Stars />
                <p className="text-[11px] tracking-[0.16em] uppercase text-white/60 mt-1">
                  Google Rating
                </p>
              </div>
            </div>
            <span className="hidden sm:block h-10 w-px bg-white/15" aria-hidden />
            <div className="text-center sm:text-left">
              <p className="font-serif text-4xl text-white leading-none">{business.reviewCount}+</p>
              <p className="text-[11px] tracking-[0.16em] uppercase text-white/60 mt-1">
                Five-Star Reviews
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade" duration={0.8}>
          <blockquote className="relative max-w-3xl mx-auto text-center mb-8 pb-8 sm:mb-12 sm:pb-12 border-b border-white/10 px-1">
            <Quote
              size={48}
              strokeWidth={0.75}
              className="mx-auto mb-4 text-curly-accent/40"
              aria-hidden
            />
            <p className="font-serif text-lg sm:text-2xl md:text-[1.75rem] leading-[1.4] italic text-white mb-5 sm:mb-6">
              {featuredReview.text}
            </p>
            <footer>
              <p className="font-serif text-lg text-white">{featuredReview.name}</p>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/60 mt-2">
                {featuredReview.date} · Google Review
              </p>
            </footer>
          </blockquote>
        </ScrollReveal>

        <StaggerReveal
          stagger={0.12}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch"
        >
          {reviews.map((review, i) => (
            <StaggerItem
              key={review.name}
              variant={i === 0 ? "left" : i === 1 ? "up" : "right"}
              className="h-full"
            >
              <ReviewCard review={review} />
            </StaggerItem>
          ))}
        </StaggerReveal>

        <ScrollReveal variant="up" delay={0.1}>
          <div className="text-center mt-8 sm:mt-12">
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-gold group gap-2.5"
            >
              Read All {business.reviewCount} Reviews on Google
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
