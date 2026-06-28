import { reviewsSection } from "../data/content";
import { useContent, type SiteContent } from "../cms/ContentProvider";
import ScrollReveal, { StaggerItem, StaggerReveal } from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

function ReviewCard({ review }: { review: SiteContent["reviews"][number] }) {
  return (
    <blockquote className="flex h-full flex-col rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-6 md:rounded-none md:p-8">
      <p className="text-curly-accent-light text-[10px] tracking-[0.28em] mb-4 shrink-0">
        {"★".repeat(5)}
      </p>
      <p className="text-white/90 text-[15px] leading-[1.7] italic mb-4 sm:mb-6 flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
      <footer className="pt-4 border-t border-white/10 mt-auto shrink-0">
        <p className="font-serif text-base text-white">{review.name}</p>
        <p className="text-[11px] tracking-[0.18em] uppercase text-white/60 mt-1">
          {review.date}
        </p>
      </footer>
    </blockquote>
  );
}

export default function Reviews() {
  const { business, featuredReview, reviews } = useContent();
  return (
    <section id="reviews" className="premium-section section-divide bg-premium-dark text-white">
      <div className="page-wrap">
        <SectionHeading
          label="Reviews"
          title={reviewsSection.heading}
          description={reviewsSection.description}
          light
        />

        <ScrollReveal variant="fade" duration={0.8}>
          <blockquote className="max-w-3xl mx-auto text-center mb-6 pb-6 sm:mb-10 sm:pb-10 border-b border-white/10 px-1">
            <p className="text-curly-accent-light text-sm tracking-[0.3em] mb-4 sm:mb-6">{"★".repeat(5)}</p>
            <p className="font-serif text-lg sm:text-2xl md:text-[1.75rem] leading-[1.35] italic text-white mb-4 sm:mb-6">
              &ldquo;{featuredReview.text}&rdquo;
            </p>
            <footer>
              <p className="font-serif text-lg text-white">{featuredReview.name}</p>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/65 mt-2">
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
          <div className="text-center mt-6 sm:mt-10">
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="curly-link-light"
            >
              Read All {business.reviewCount} Reviews on Google
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
