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
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={item.title}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 h-11 w-11 inline-flex items-center justify-center text-white/80 hover:text-white"
        aria-label="Close"
      >
        <X size={24} strokeWidth={1.5} />
      </button>
      <figure
        className="relative max-h-[90vh] max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <SafeImage
          src={item.image}
          alt={`${item.title}, Albert K Studio`}
          className="w-full max-h-[80vh] object-contain"
        />
        <figcaption className="mt-4 text-center">
          <p className="text-[10px] tracking-[0.24em] uppercase text-curly-accent-light mb-1">
            {item.category}
          </p>
          <p className="font-serif text-xl text-white">{item.title}</p>
        </figcaption>
      </figure>
    </div>
  );
}
