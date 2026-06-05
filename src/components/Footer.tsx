import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { business, workingHours } from "../data/content";
import BrandLogo from "./BrandLogo";

function FooterColumn({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <h2 className="curly-label text-curly-accent-light mb-4 sm:mb-6 shrink-0">{label}</h2>
      <div className="flex md:min-h-[7.5rem] flex-col gap-3 text-sm">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-premium-dark text-white section-divide pb-[var(--bottom-nav-height)] lg:pb-0">
      <div className="page-wrap py-10 sm:py-14 md:py-20">
        <div className="card-grid-equal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-10 xl:gap-14">
          <div className="flex h-full flex-col sm:col-span-2 lg:col-span-1">
            <div className="mb-6 min-h-[3.5rem] flex items-center">
              <a href="#home" className="inline-block">
                <BrandLogo
                  variant="hero"
                  className="!h-12 sm:!h-14 md:!h-16 !max-w-[18rem] object-left"
                />
              </a>
            </div>
            <p className="text-on-dark text-sm leading-[1.75] mb-5 sm:mb-8 max-w-[16rem]">
              {business.subTagline}. Luxury cuts, color, and styling in Town Center Aventura.
            </p>
            <div className="flex items-center gap-5 mt-auto">
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 inline-flex items-center justify-center border border-white/20 text-white/85 hover:border-curly-accent-light hover:text-curly-accent-light transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a href="#booking" className="curly-link-light">
                Request Appointment
              </a>
            </div>
          </div>

          <FooterColumn label="Contact">
            <p className="text-on-dark leading-[1.75]">{business.address}</p>
            <a
              href={business.phoneHref}
              className="text-on-dark hover:text-curly-accent-light transition-colors w-fit"
            >
              {business.phone}
            </a>
            <a
              href={`mailto:${business.email}`}
              className="text-on-dark hover:text-curly-accent-light transition-colors w-fit"
            >
              {business.email}
            </a>
          </FooterColumn>

          <FooterColumn label="Hours">
            {workingHours.map((item) => (
              <div key={item.day}>
                <p className="text-muted-on-dark">{item.day}</p>
                <p className="text-white/90">{item.hours}</p>
              </div>
            ))}
          </FooterColumn>

          <FooterColumn label="Location">
            <p className="font-serif text-lg text-white leading-snug">Town Center Aventura</p>
            <p className="text-on-dark leading-[1.75]">{business.addressShort}</p>
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-on-dark hover:text-curly-accent-light transition-colors w-fit mt-1 group"
            >
              <MapPin
                size={14}
                strokeWidth={1.5}
                className="text-curly-accent-light shrink-0"
              />
              <span className="border-b border-white/25 pb-0.5 text-[10px] font-medium tracking-[0.22em] uppercase group-hover:border-curly-accent-light">
                Open in Google Maps
              </span>
            </a>
          </FooterColumn>
        </div>

        <div className="mt-10 overflow-hidden border border-white/10">
          <iframe
            title="Albert K Studio location on Google Maps"
            src={business.mapsEmbedUrl}
            className="w-full h-52 sm:h-60"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-wrap py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] tracking-[0.18em] uppercase text-white/55">
          <p>&copy; {new Date().getFullYear()} {business.name}</p>
          <p>
            {business.googleRating}.0 ★ · {business.reviewCount} Reviews · Aventura, FL
          </p>
        </div>
      </div>
    </footer>
  );
}
