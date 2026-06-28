import { images } from "../data/images";

type BrandLogoVariant = "hero" | "solid" | "footer";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  /** @deprecated Use `variant` instead */
  light?: boolean;
  className?: string;
};

export default function BrandLogo({
  variant,
  light,
  className = "",
}: BrandLogoProps) {
  const resolved: BrandLogoVariant =
    variant ?? (light ? "hero" : "solid");

  const isBlack = resolved === "solid";
  const png = images.logo.light;
  const webp = png.replace(/\.png$/, ".webp");
  const avif = png.replace(/\.png$/, ".avif");

  return (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={avif} />
      <source type="image/webp" srcSet={webp} />
      <img
        src={png}
        alt="Albert K Studio"
        className={`h-[3.25rem] sm:h-14 md:h-20 lg:h-[5.25rem] w-auto max-w-[min(440px,74vw)] object-contain object-left transition-[filter] duration-300 ${
          isBlack ? "brightness-0" : ""
        } ${className}`}
        width={440}
        height={84}
        decoding="async"
      />
    </picture>
  );
}
