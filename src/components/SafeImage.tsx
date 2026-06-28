import { useEffect, useRef, useState, type CSSProperties } from "react";
import { images } from "../data/images";
import { optimizedImages } from "../data/optimizedImages";

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export default function SafeImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  style,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src ?? images.fallback);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Only use the optimized <picture> path when the source is unchanged from the
  // original (no error fallback in play) and we have generated variants for it.
  const optimized =
    typeof imgSrc === "string" && imgSrc === src ? optimizedImages[imgSrc] : undefined;

  useEffect(() => {
    setImgSrc(src ?? images.fallback);
    setLoaded(false);
  }, [src]);

  // Cached images can finish loading before React attaches the onLoad
  // handler, so the load event never fires and the image stays hidden.
  // Detect that case by reading the element's `complete` state after render.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [imgSrc]);

  const showBlur = Boolean(optimized) && !loaded;
  const mergedStyle: CSSProperties | undefined = showBlur
    ? {
        backgroundImage: `url(${optimized!.lqip})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...style,
      }
    : style;

  const img = (
    <img
      {...props}
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      style={mergedStyle}
      className={`${optimized ? "" : "transition-opacity duration-700 ease-out"} ${
        loaded || optimized ? "opacity-100" : "opacity-0"
      } ${className}`}
      loading={loading}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (imgSrc !== images.fallback) {
          setImgSrc(images.fallback);
          setLoaded(false);
        }
      }}
    />
  );

  if (!optimized) return img;

  // display:contents keeps the <img> as the layout box so every existing
  // call site (aspect ratios, object-cover, absolute inset-0) behaves the same.
  return (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={optimized.avif} />
      <source type="image/webp" srcSet={optimized.webp} />
      {img}
    </picture>
  );
}
