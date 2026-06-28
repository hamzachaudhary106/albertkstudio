import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { routes } from "../data/content";
import { useContent } from "../cms/ContentProvider";
import { images } from "../data/images";
import ScrollReveal from "./ScrollReveal";
import SafeImage from "./SafeImage";

export default function OurStory() {
  const { about, business } = useContent();
  const reduced = useReducedMotion();
  const imgWrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: imgWrapRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [28, -28]);

  return (
    <section
      id="about"
      className="premium-section section-divide bg-premium-pearl relative overflow-hidden"
    >
      <div
        className="glow-blob -left-32 top-10 h-80 w-80 opacity-60"
        style={{ background: "radial-gradient(circle, rgba(184,149,110,0.18), transparent 70%)" }}
        aria-hidden
      />
      <div className="page-wrap relative">
        <div className="grid-2 items-center">
          <ScrollReveal variant="left" duration={0.85}>
            <div ref={imgWrapRef} className="relative corner-frame">
              <div className="relative overflow-hidden rounded-2xl md:rounded-none">
                <motion.div style={{ y }} className="will-change-transform">
                  <SafeImage
                    src={images.gallery.dimensionalBlonde}
                    alt="Dimensional blonde color work at Albert K Studio, Aventura"
                    className="w-full aspect-[5/4] sm:aspect-[4/5] object-cover scale-[1.08]"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating years badge */}
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 right-0 hidden md:block translate-x-5 translate-y-5"
              >
                <div className="relative bg-premium-dark px-8 py-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
                  <span className="absolute inset-x-0 top-0 h-px hairline-gold" aria-hidden />
                  <p className="font-serif text-5xl text-gold-gradient-light leading-none mb-1">
                    15+
                  </p>
                  <p className="text-[10px] tracking-[0.24em] uppercase text-white/75">
                    Years in Aventura
                  </p>
                </div>
              </motion.div>

              {/* Vertical established label */}
              <span
                className="absolute -left-3 top-6 hidden lg:block text-[10px] tracking-[0.34em] uppercase text-curly-accent-dark/70 [writing-mode:vertical-rl] rotate-180"
                aria-hidden
              >
                {business.since}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="right" delay={0.1} duration={0.85}>
            <div>
              <p className="curly-label-gold mb-4">
                {business.locationTag} · {business.since}
              </p>
              <h2 className="curly-heading-lg mb-5">{about.heading}</h2>

              <figure className="relative mb-6 sm:mb-7 pl-7">
                <Quote
                  size={26}
                  strokeWidth={1.25}
                  className="absolute -left-0.5 -top-1 text-curly-accent/45"
                  aria-hidden
                />
                <span
                  className="absolute left-0 top-2 bottom-1 w-px bg-gradient-to-b from-curly-accent via-curly-accent/40 to-transparent"
                  aria-hidden
                />
                <blockquote className="font-serif text-xl sm:text-2xl italic text-curly-black leading-[1.4]">
                  {about.pullQuote}
                </blockquote>
              </figure>

              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="prose-body-sm mb-4 last:mb-0">
                  {p}
                </p>
              ))}

              <Link
                to={routes.services}
                className="group link-underline mt-8 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] uppercase text-curly-black"
              >
                View Services
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="text-curly-accent-dark transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
