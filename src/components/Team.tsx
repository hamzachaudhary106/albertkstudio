import { stylists } from "../data/content";
import { setPreferredStylist } from "../lib/stylist";
import { StaggerItem, StaggerReveal } from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";

const CARD_VARIANTS = ["left", "up", "right"] as const;

function StylistCard({ stylist }: { stylist: (typeof stylists)[0] }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-curly-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:rounded-none md:shadow-none">
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden">
        {stylist.image ? (
          <SafeImage
            src={stylist.image}
            alt={`${stylist.name}, ${stylist.role} at Albert K Studio`}
            className="absolute inset-0 h-full w-full object-cover object-[center_20%] transition-transform duration-700 group-active:scale-[1.03] md:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-premium-dark to-[#1a1a1a]">
            <span className="font-serif text-7xl leading-none text-curly-accent-light/25 mb-3">
              {stylist.initials}
            </span>
            <span className="text-[10px] tracking-[0.24em] uppercase text-white/40">
              Photo Coming Soon
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h3 className="font-serif text-2xl text-white mb-1">{stylist.name}</h3>
          <p className="text-[10px] tracking-[0.22em] uppercase text-curly-accent-light">
            {stylist.role}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col card-pad bg-premium-pearl">
        <p className="curly-label mb-3">{stylist.specialty}</p>
        <p className="prose-body-sm text-sm mb-5 flex-1">{stylist.bio}</p>
        <a
          href="#booking"
          onClick={() => setPreferredStylist(stylist.id)}
          className="curly-link w-fit mt-auto"
        >
          Book with {stylist.name.split(" ")[0]}
        </a>
      </div>
    </article>
  );
}

export default function Team() {
  return (
    <section id="team" className="premium-section section-divide bg-white">
      <div className="page-wrap">
        <SectionHeading
          label="The Artists"
          title="Meet Your Stylists"
          description="Albert leads our chair. Christine and Elena complete the team with color and styling expertise."
        />

        <StaggerReveal
          stagger={0.12}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 items-stretch"
        >
          {stylists.map((stylist, i) => (
            <StaggerItem
              key={stylist.id}
              variant={CARD_VARIANTS[i % CARD_VARIANTS.length]}
              className="h-full"
            >
              <StylistCard stylist={stylist} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
