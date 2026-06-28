import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reviews from "../components/Reviews";
import CTABand from "../components/CTABand";
import ScrollReveal from "../components/ScrollReveal";
import { business, pageMeta } from "../data/content";

const stats = [
  { value: "5.0★", label: "Average Google Rating" },
  { value: "142", label: "Five-Star Reviews" },
  { value: "15+", label: "Years in Aventura" },
];

export default function ReviewsPage() {
  return (
    <>
      <Seo title={pageMeta.reviews.title} description={pageMeta.reviews.description} />
      <PageHero
        eyebrow={pageMeta.reviews.eyebrow}
        title={pageMeta.reviews.title}
        description={pageMeta.reviews.description}
      />

      <section className="bg-premium-pearl section-divide">
        <div className="page-wrap py-10 sm:py-14">
          <ScrollReveal variant="up">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center divide-x divide-curly-border">
              {stats.map((stat) => (
                <div key={stat.label} className="px-2">
                  <p className="font-serif text-3xl sm:text-5xl text-curly-accent-dark mb-2">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-curly-muted leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Reviews />

      <CTABand
        title="Become our next five-star review"
        description={`Join ${business.reviewCount}+ happy clients across South Florida. Request your appointment today.`}
      />
    </>
  );
}
