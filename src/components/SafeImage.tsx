import { useEffect, useState } from "react";
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

  useEffect(() => {
    setImgSrc(src ?? images.fallback);
    setLoaded(false);
  }, [src]);

  return (
    <img
      {...props}
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
