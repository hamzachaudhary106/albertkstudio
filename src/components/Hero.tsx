import { motion } from "framer-motion";
import { business, hero } from "../data/content";
import { images } from "../data/images";
import SafeImage from "./SafeImage";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-premium-dark"
    >
      <SafeImage
        src={images.hero}
        alt="Albert K Studio luxury hair salon interior, Aventura Florida"
        className="absolute inset-0 w-full h-full object-cover object-center md:object-[center_30%]"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 md:from-black/40" />

      <div
        className="shrink-0 h-[calc(var(--header-height)+var(--safe-top)+1.25rem)] md:h-[calc(var(--header-height)+var(--safe-top)+2rem)]"
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center page-wrap w-full pb-[calc(1.5rem+var(--bottom-nav-height))] sm:pb-20 md:pb-28">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="curly-label-gold mb-4 !text-curly-accent-light"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-serif text-[clamp(2rem,7.5vw,4rem)] leading-[1.08] text-white mb-4 sm:mb-5"
          >
            {hero.titleLine1}
            <br />
            <em className="text-curly-accent-light font-normal italic">{hero.titleAccent}</em>{" "}
            {hero.titleLine2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-white/90 text-[15px] sm:text-base md:text-[1.0625rem] leading-[1.7] mb-6 sm:mb-8"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mobile-btn-stack mb-8"
          >
            <a href="#booking" className="curly-btn-gold">
              Book Appointment
            </a>
            <a href="#gallery" className="curly-btn-outline-light">
              View Our Work
            </a>
          </motion.div>

          <p className="text-white/75 text-[11px] tracking-[0.2em] uppercase">
            {business.googleRating}.0 ★ · {business.reviewCount} Google Reviews · {business.addressShort}
          </p>
        </div>
      </div>
    </section>
  );
}
