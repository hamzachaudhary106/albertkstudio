import { Link } from "react-router-dom";
import { routes } from "../data/content";
import { useContent } from "../cms/ContentProvider";
import { images } from "../data/images";
import ScrollReveal from "./ScrollReveal";
import SafeImage from "./SafeImage";

export default function OurStory() {
  const { about, business } = useContent();
  return (
    <section id="about" className="premium-section section-divide bg-premium-pearl">
      <div className="page-wrap">
        <div className="grid-2 items-center">
          <ScrollReveal variant="left" duration={0.8}>
            <div className="relative">
              <SafeImage
                src={images.gallery.dimensionalBlonde}
                alt="Dimensional blonde color work at Albert K Studio, Aventura"
                className="w-full aspect-[5/4] sm:aspect-[4/5] object-cover rounded-2xl md:rounded-none"
              />
              <div className="absolute bottom-0 right-0 bg-premium-dark text-white px-8 py-6 hidden md:block translate-x-4 translate-y-4">
                <p className="font-serif text-4xl text-curly-accent-light leading-none mb-1">15+</p>
                <p className="text-[11px] tracking-[0.22em] uppercase text-white/80">Years in Aventura</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="right" delay={0.1} duration={0.8}>
            <div>
              <p className="curly-label-gold mb-3">
                {business.locationTag} · {business.since}
              </p>
              <h2 className="curly-heading-lg mb-4">{about.heading}</h2>
              <div className="gold-rule mb-6" />
              <blockquote className="font-serif text-xl sm:text-2xl italic text-curly-black leading-[1.35] mb-5 sm:mb-6 pl-4 sm:pl-5 border-l-2 border-curly-accent">
                &ldquo;{about.pullQuote}&rdquo;
              </blockquote>
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="prose-body-sm mb-4 last:mb-0">
                  {p}
                </p>
              ))}
              <Link to={routes.services} className="curly-link mt-8">
                View Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
