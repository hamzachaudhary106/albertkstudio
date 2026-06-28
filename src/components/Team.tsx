import { Link } from "react-router-dom";
import { ArrowRight, Award, Sparkles } from "lucide-react";
import { routes, teamSection } from "../data/content";
import { useContent } from "../cms/ContentProvider";
import { setPreferredStylist } from "../lib/stylist";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";
import InstagramIcon from "./InstagramIcon";

const credentials = [
  { icon: Award, label: "Master Stylist" },
  { icon: Sparkles, label: "Platinum Specialist" },
];

export default function Team() {
  const { stylists, business } = useContent();
  const albert = stylists[0];
  if (!albert) return null;

  const specialties = albert.specialty.split("·").map((s) => s.trim());

  return (
    <section
      id="team"
      className="premium-section section-divide bg-white relative overflow-hidden"
    >
      <div
        className="glow-blob -right-24 bottom-0 h-80 w-80 opacity-50"
        style={{ background: "radial-gradient(circle, rgba(184,149,110,0.14), transparent 70%)" }}
        aria-hidden
      />
      <div className="page-wrap relative">
        <SectionHeading
          label={teamSection.label}
          title={teamSection.title}
          description={teamSection.description}
        />

        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center">
          <ScrollReveal variant="left" duration={0.8}>
            <div className="relative corner-frame">
              <div className="relative overflow-hidden rounded-2xl md:rounded-none">
                <SafeImage
                  src={albert.image}
                  alt={`${albert.name}, ${albert.role} at Albert K Studio`}
                  className="w-full aspect-[4/5] object-cover object-[center_20%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="absolute left-6 right-6 top-0 h-px hairline-gold opacity-60" aria-hidden />
                  <h3 className="font-serif text-3xl text-white mb-1.5">{albert.name}</h3>
                  <p className="text-[10px] tracking-[0.24em] uppercase text-curly-accent-light">
                    {albert.role}
                  </p>
                </div>
              </div>

              {/* Floating rating badge */}
              <div className="absolute -top-4 -right-3 hidden sm:flex flex-col items-center justify-center h-20 w-20 rounded-full bg-premium-dark text-center shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] float-soft">
                <span className="font-serif text-2xl text-gold-gradient-light leading-none">
                  {business.googleRating.toFixed(1)}
                </span>
                <span className="text-[8px] tracking-[0.2em] uppercase text-white/70 mt-0.5">
                  ★ Rated
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="right" delay={0.1} duration={0.8}>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap gap-2.5 mb-6">
                {credentials.map(({ icon: Icon, label }) => (
                  <span key={label} className="pill-luxe">
                    <Icon size={12} strokeWidth={1.75} />
                    {label}
                  </span>
                ))}
              </div>

              <p className="prose-body mb-7">{albert.bio}</p>

              <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-curly-border border-y border-curly-border">
                {specialties.map((s) => (
                  <div key={s} className="py-3 sm:py-4 sm:px-4 first:sm:pl-0">
                    <p className="font-serif text-[15px] leading-tight text-curly-black">{s}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  to={routes.book}
                  onClick={() => setPreferredStylist(albert.id)}
                  className="curly-btn-gold btn-luxe group w-full sm:w-fit gap-2.5"
                >
                  Request with Albert
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-11 text-[11px] font-semibold tracking-[0.2em] uppercase text-curly-body transition-colors hover:text-curly-accent-dark"
                >
                  <InstagramIcon size={15} strokeWidth={1.5} />
                  Follow the work
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
