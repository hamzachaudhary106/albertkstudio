import { stylists, teamSection } from "../data/content";
import { setPreferredStylist } from "../lib/stylist";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";

export default function Team() {
  const albert = stylists[0];

  return (
    <section id="team" className="premium-section section-divide bg-white">
      <div className="page-wrap">
        <SectionHeading
          label={teamSection.label}
          title={teamSection.title}
          description={teamSection.description}
        />

        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center">
          <ScrollReveal variant="left" duration={0.75}>
            <div className="relative overflow-hidden rounded-2xl border border-curly-border md:rounded-none">
              <SafeImage
                src={albert.image}
                alt={`${albert.name}, ${albert.role} at Albert K Studio`}
                className="w-full aspect-[4/5] object-cover object-[center_20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-3xl text-white mb-1">{albert.name}</h3>
                <p className="text-[10px] tracking-[0.22em] uppercase text-curly-accent-light">
                  {albert.role}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="right" delay={0.1} duration={0.75}>
            <div className="flex flex-col justify-center">
              <p className="curly-label-gold mb-4">{albert.specialty}</p>
              <p className="prose-body-sm mb-8">{albert.bio}</p>
              <a
                href="#booking"
                onClick={() => setPreferredStylist(albert.id)}
                className="curly-btn-gold w-full sm:w-fit"
              >
                Request with Albert
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
