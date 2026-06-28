import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ZoomIn } from "lucide-react";
import { gallery, routes } from "../data/content";
import { useContent } from "../cms/ContentProvider";
import GalleryLightbox from "./GalleryLightbox";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";
import type { RevealVariant } from "./ScrollReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const CARD_VARIANTS: RevealVariant[] = [
  "scale",
  "left",
  "up",
  "right",
  "up",
  "left",
  "right",
  "up",
  "fade",
];

function cardMotion(variant: RevealVariant, reduced: boolean) {
  if (reduced) {
    return { off: { opacity: 0 }, on: { opacity: 1 } };
  }

  const map = {
    left: { off: { opacity: 0, x: -48 }, on: { opacity: 1, x: 0 } },
    right: { off: { opacity: 0, x: 48 }, on: { opacity: 1, x: 0 } },
    up: { off: { opacity: 0, y: 40 }, on: { opacity: 1, y: 0 } },
    down: { off: { opacity: 0, y: -32 }, on: { opacity: 1, y: 0 } },
    fade: { off: { opacity: 0 }, on: { opacity: 1 } },
    scale: { off: { opacity: 0, scale: 0.94 }, on: { opacity: 1, scale: 1 } },
  };

  return map[variant];
}

function GalleryCardOverlay({
  item,
  large = false,
}: {
  item: (typeof gallery.items)[0];
  large?: boolean;
}) {
  return (
    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pt-16 pb-4 px-4 pointer-events-none">
      <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-curly-accent-light mb-1.5">
        <span className="h-1 w-1 rotate-45 bg-curly-accent-light" aria-hidden />
        {item.category}
      </span>
      <span
        className={`block font-serif text-white leading-tight ${large ? "text-xl sm:text-2xl" : "text-base"}`}
      >
        {item.title}
      </span>
    </span>
  );
}

function ZoomBadge() {
  return (
    <span
      className="pointer-events-none absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-md opacity-0 scale-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
      aria-hidden
    >
      <ZoomIn size={16} strokeWidth={1.5} />
    </span>
  );
}

function MobileGallerySlider({
  items,
  onOpen,
}: {
  items: typeof gallery.items;
  onOpen: (index: number) => void;
}) {
  return (
    <div className="flex md:hidden mobile-snap-row">
      {items.map((item, i) => (
        <div
          key={item.title}
          className={`mobile-snap-card ${item.featured ? "mobile-snap-card-lg" : "mobile-snap-card-md"}`}
        >
          <button
            type="button"
            onClick={() => onOpen(i)}
            className="group relative block w-full overflow-hidden rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-curly-accent"
          >
            <SafeImage
              src={item.image}
              alt={`${item.title}, Albert K Studio, Aventura`}
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-active:scale-[1.02]"
            />
            <GalleryCardOverlay item={item} large={item.featured} />
          </button>
        </div>
      ))}
    </div>
  );
}

function GalleryCard({
  item,
  className = "",
  onOpen,
  variant,
  delay = 0,
}: {
  item: (typeof gallery.items)[0];
  className?: string;
  onOpen: () => void;
  variant: RevealVariant;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const isFeatured = item.featured;

  return (
    <motion.button
      type="button"
      initial="off"
      whileInView="on"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
      variants={cardMotion(variant, !!reduced)}
      transition={{ duration: reduced ? 0.2 : 0.65, delay, ease: EASE }}
      onClick={onOpen}
      className={`group relative overflow-hidden text-left w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-curly-accent ${className}`}
    >
      <SafeImage
        src={item.image}
        alt={`${item.title}, Albert K Studio, Aventura`}
        className={`w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] ${
          isFeatured ? "aspect-auto h-full min-h-[28rem]" : "aspect-[4/5]"
        }`}
      />
      <span
        className="pointer-events-none absolute inset-0 z-10 border border-curly-accent-light/0 transition-colors duration-500 group-hover:border-curly-accent-light/60"
        aria-hidden
      />
      <ZoomBadge />
      <GalleryCardOverlay item={item} large={isFeatured} />
    </motion.button>
  );
}

type GalleryProps = {
  /** "teaser" links to the full gallery page; "full" links to booking. */
  variant?: "teaser" | "full";
};

export default function Gallery({ variant = "full" }: GalleryProps) {
  const { galleryItems } = useContent();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isTeaser = variant === "teaser";

  return (
    <section
      id="gallery"
      className="premium-section section-divide bg-premium-dark relative overflow-hidden"
    >
      <div
        className="glow-blob left-1/2 -translate-x-1/2 -top-24 h-72 w-[36rem] opacity-40"
        style={{ background: "radial-gradient(circle, rgba(184,149,110,0.35), transparent 70%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 grain-overlay opacity-[0.12]" aria-hidden />
      <div className="page-wrap relative">
        <SectionHeading
          label="Portfolio"
          title={gallery.heading}
          description={gallery.description}
          light
        />

        <MobileGallerySlider items={galleryItems} onOpen={setActiveIndex} />

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3">
          {galleryItems.map((item, i) => (
            <GalleryCard
              key={item.title}
              item={item}
              onOpen={() => setActiveIndex(i)}
              variant={CARD_VARIANTS[i % CARD_VARIANTS.length]}
              delay={i * 0.06}
              className={item.featured ? "col-span-2 row-span-2" : ""}
            />
          ))}
        </div>

        <ScrollReveal variant="fade" delay={0.2}>
          <p className="text-center text-white/50 text-[11px] tracking-[0.18em] uppercase mt-4 md:hidden">
            Swipe to browse · Tap to view full gallery
          </p>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={0.1}>
          <div className="text-center mt-7 sm:mt-10 md:mt-12">
            {isTeaser ? (
              <Link
                to={routes.gallery}
                className="group inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.24em] uppercase text-white transition-colors hover:text-curly-accent-light"
              >
                <span className="h-px w-7 bg-curly-accent-light/70 transition-all duration-300 group-hover:w-10" />
                View Full Gallery
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="text-curly-accent-light transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <Link
                to={routes.book}
                className="group inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.24em] uppercase text-white transition-colors hover:text-curly-accent-light"
              >
                <span className="h-px w-7 bg-curly-accent-light/70 transition-all duration-300 group-hover:w-10" />
                Request Appointment
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="text-curly-accent-light transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>
        </ScrollReveal>
      </div>

      <GalleryLightbox
        items={galleryItems}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onChangeIndex={setActiveIndex}
      />
    </section>
  );
}
