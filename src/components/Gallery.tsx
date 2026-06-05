import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gallery } from "../data/content";
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
      className={`group relative overflow-hidden text-left w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-curly-accent rounded-2xl md:rounded-none ${className}`}
    >
      <SafeImage
        src={item.image}
        alt={`${item.title}, Albert K Studio, Aventura`}
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] group-active:scale-[1.02] ${
          isFeatured
            ? "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[28rem]"
            : "aspect-[4/5] md:aspect-[4/5]"
        }`}
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent pt-14 pb-4 px-4 pointer-events-none">
        <span className="block text-[10px] tracking-[0.22em] uppercase text-curly-accent-light mb-1">
          {item.category}
        </span>
        <span className={`block font-serif text-white leading-tight ${isFeatured ? "text-xl" : "text-base"}`}>
          {item.title}
        </span>
      </span>
    </motion.button>
  );
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="premium-section section-divide bg-premium-dark">
      <div className="page-wrap">
        <SectionHeading
          label="Portfolio"
          title={gallery.heading}
          description={gallery.description}
          light
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {gallery.items.map((item, i) => (
            <GalleryCard
              key={item.title}
              item={item}
              onOpen={() => setActiveIndex(i)}
              variant={CARD_VARIANTS[i % CARD_VARIANTS.length]}
              delay={i * 0.06}
              className={item.featured ? "sm:col-span-2 sm:row-span-2" : ""}
            />
          ))}
        </div>

        <ScrollReveal variant="fade" delay={0.2}>
          <p className="text-center text-white/50 text-[11px] tracking-[0.18em] uppercase mt-4 lg:hidden">
            Tap any image to enlarge
          </p>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={0.1}>
          <div className="text-center mt-5 sm:mt-8 md:mt-10">
            <a href="#booking" className="curly-link-light">
              Request Appointment
            </a>
          </div>
        </ScrollReveal>
      </div>

      <GalleryLightbox
        items={gallery.items}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onChangeIndex={setActiveIndex}
      />
    </section>
  );
}
