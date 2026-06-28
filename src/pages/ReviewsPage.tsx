import { Award, Star, Users } from "lucide-react";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reviews from "../components/Reviews";
import CTABand from "../components/CTABand";
import ScrollReveal from "../components/ScrollReveal";
import { pageMeta } from "../data/content";
import { useContent } from "../cms/ContentProvider";
import { images } from "../data/images";

const stats = [
  { value: "5.0★", label: "Average Google Rating", icon: Star },
  { value: "142", label: "Five-Star Reviews", icon: Award },
  { value: "15+", label: "Years in Aventura", icon: Users },
];

export default function ReviewsPage() {
  const { business } = useContent();
  return (
    <>
      <Seo title={pageMeta.reviews.title} description={pageMeta.reviews.description} />
      <PageHero
        eyebrow={pageMeta.reviews.eyebrow}
        title={pageMeta.reviews.title}
        description={pageMeta.reviews.description}
        image={images.gallery.sleekBrunette}
        imagePosition="object-[center_25%]"
      />

      <section className="bg-premium-pearl section-divide">
        <div className="page-wrap py-10 sm:py-14">
          <ScrollReveal variant="up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="lift-card flex items-center gap-4 border border-curly-border bg-white p-5 sm:flex-col sm:gap-2 sm:p-7 sm:text-center"
                  >
                    <span className="stat-chip shrink-0 sm:h-12 sm:w-12">
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                    <div className="sm:mt-2">
                      <p className="font-serif text-3xl sm:text-4xl text-curly-accent-dark leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-curly-muted leading-snug mt-1.5">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
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
