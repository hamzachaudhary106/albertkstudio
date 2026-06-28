import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SafeImage from "./SafeImage";

export type GalleryItem = {
  image: string;
  title: string;
  category: string;
};

type GalleryLightboxProps = {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
};

const SWIPE_THRESHOLD = 48;

export default function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) {
  const isOpen = activeIndex !== null && items.length > 0;
  const item = activeIndex !== null ? items[activeIndex] : null;

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onChangeIndex(activeIndex === 0 ? items.length - 1 : activeIndex - 1);
  }, [activeIndex, items.length, onChangeIndex]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onChangeIndex(activeIndex === items.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, items.length, onChangeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, goPrev, goNext]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x >= SWIPE_THRESHOLD) goPrev();
  };

  if (!isOpen || !item || activeIndex === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[80] flex flex-col bg-black/96 backdrop-blur-sm"
      role="dialog"
      aria-modal
      aria-label={`Portfolio: ${item.title}`}
    >
      <header className="relative z-30 flex shrink-0 items-center justify-between gap-4 px-4 pb-3 pt-[calc(0.75rem+var(--safe-top))]">
        <p className="text-[11px] tracking-[0.2em] uppercase text-white/55">
          {activeIndex + 1} of {items.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-white/15 px-4 text-white active:scale-95 touch-manipulation"
          aria-label="Close portfolio"
        >
          <X size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium tracking-[0.18em] uppercase md:sr-only">
            Close
          </span>
        </button>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16">
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 sm:left-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white active:scale-95 touch-manipulation"
          aria-label="Previous image"
        >
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="flex w-full max-w-4xl flex-col items-center justify-center touch-pan-y"
          >
            <SafeImage
              src={item.image}
              alt={`${item.title}, Albert K Studio`}
              className="max-h-[58vh] sm:max-h-[68vh] md:max-h-[72vh] w-auto max-w-full object-contain rounded-lg"
              draggable={false}
            />
            <figcaption className="mt-4 text-center px-2">
              <p className="text-[10px] tracking-[0.24em] uppercase text-curly-accent-light mb-1">
                {item.category}
              </p>
              <p className="font-serif text-lg sm:text-xl text-white">{item.title}</p>
            </figcaption>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 sm:right-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white active:scale-95 touch-manipulation"
          aria-label="Next image"
        >
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative z-30 shrink-0 px-4 pb-[calc(1rem+var(--bottom-nav-height))] pt-2 md:pb-6">
        <div className="flex justify-center gap-1.5 mb-3">
          {items.map((entry, i) => (
            <button
              key={entry.title}
              type="button"
              onClick={() => onChangeIndex(i)}
              className={`h-1.5 rounded-full transition-all touch-manipulation ${
                i === activeIndex ? "w-5 bg-curly-accent-light" : "w-1.5 bg-white/30"
              }`}
              aria-label={`View ${entry.title}`}
              aria-current={i === activeIndex}
            />
          ))}
        </div>
        <p className="text-center text-white/40 text-[10px] tracking-[0.16em] uppercase">
          Swipe or use arrows to browse
        </p>
      </div>
    </motion.div>
  );
}
