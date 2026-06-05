import { signatureWork } from "../data/content";
import ScrollReveal from "./ScrollReveal";
import SafeImage from "./SafeImage";

export default function Transformations() {
  return (
    <section className="section-divide bg-premium-ivory">
      <div className="page-wrap py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal variant="left">
            <div>
              <p className="curly-label-gold mb-3">{signatureWork.label}</p>
              <h2 className="curly-heading-lg mb-4">{signatureWork.title}</h2>
              <div className="gold-rule mb-5" />
              <p className="prose-body-sm max-w-md mb-8">{signatureWork.description}</p>
              <a href="#gallery" className="curly-link">
                View Full Portfolio
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="right" delay={0.12}>
            <figure>
              <div className="relative overflow-hidden aspect-[4/5] border border-curly-border">
                <SafeImage
                  src={signatureWork.image}
                  alt={signatureWork.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4">
                <p className="text-[11px] text-curly-body tracking-wide font-medium">
                  {signatureWork.caption}
                </p>
                <span className="text-[10px] tracking-[0.22em] uppercase text-curly-muted shrink-0">
                  Portfolio
                </span>
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
