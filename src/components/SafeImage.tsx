import { useEffect, useRef, useState } from "react";
import { images } from "../data/images";

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export default function SafeImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src ?? images.fallback);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  return (
    <img
      {...props}
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      className={`transition-opacity duration-700 ease-out ${
        loaded ? "opacity-100" : "opacity-0"
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
}
