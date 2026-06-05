import { useEffect } from "react";
import { X } from "lucide-react";
import SafeImage from "./SafeImage";

type GalleryLightboxProps = {
  item: { image: string; title: string; category: string } | null;
  onClose: () => void;
};

export default function GalleryLightbox({ item, onClose }: GalleryLightboxProps) {
  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-black/95 md:items-center md:justify-center md:bg-black/90 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={item.title}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[calc(0.75rem+var(--safe-top))] right-[calc(0.75rem+var(--safe-right))] h-12 w-12 inline-flex items-center justify-center rounded-full bg-white/10 text-white/90 active:scale-95 md:top-4 md:right-4 md:bg-transparent"
        aria-label="Close"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      <figure
        className="relative flex flex-1 flex-col justify-center w-full max-w-4xl px-3 pt-14 pb-[calc(1rem+var(--bottom-nav-height))] md:px-0 md:py-0 md:flex-none"
        onClick={(e) => e.stopPropagation()}
      >
        <SafeImage
          src={item.image}
          alt={`${item.title}, Albert K Studio`}
          className="w-full max-h-[72vh] md:max-h-[80vh] object-contain mx-auto rounded-xl md:rounded-none"
        />
        <figcaption className="mt-4 text-center shrink-0">
          <p className="text-[10px] tracking-[0.24em] uppercase text-curly-accent-light mb-1">
            {item.category}
          </p>
          <p className="font-serif text-xl text-white">{item.title}</p>
          <p className="text-white/45 text-[11px] tracking-[0.16em] uppercase mt-3 md:hidden">
            Tap outside to close
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
