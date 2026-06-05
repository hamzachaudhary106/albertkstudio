import { stylists } from "../data/content";
import { StaggerItem, StaggerReveal } from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";

const CARD_VARIANTS = ["left", "up", "right"] as const;

const PREFERRED_STYLIST_KEY = "aks-preferred-stylist";

function setPreferredStylist(id: string) {
  sessionStorage.setItem(PREFERRED_STYLIST_KEY, id);
}

export function getPreferredStylist(): string | null {
  return sessionStorage.getItem(PREFERRED_STYLIST_KEY);
}

function StylistCard({ stylist }: { stylist: (typeof stylists)[0] }) {
  return (
    <article className="card-equal group mobile-card h-full">
      <div className="relative aspect-[4/5] shrink-0 overflow-hidden">
        {stylist.image ? (
          <SafeImage
            src={stylist.image}
            alt={`${stylist.name}, ${stylist.role} at Albert K Studio`}
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-active:scale-[1.03] md:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-premium-dark to-[#1a1a1a] flex flex-col items-center justify-center">
            <span className="font-serif text-7xl text-curly-accent-light/25 leading-none mb-3">
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
      <div className="card-pad bg-premium-pearl card-equal-body">
        <p className="curly-label card-equal-label mb-3">{stylist.specialty}</p>
        <p className="prose-body-sm text-sm card-equal-text mb-6">{stylist.bio}</p>
        <a
          href="#booking"
          onClick={() => setPreferredStylist(stylist.id)}
          className="curly-link mt-auto"
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

        <div className="md:hidden mobile-snap-row">
          {stylists.map((stylist) => (
            <div key={stylist.name} className="mobile-snap-card mobile-snap-card-lg h-full">
              <StylistCard stylist={stylist} />
            </div>
          ))}
        </div>

        <StaggerReveal
          stagger={0.15}
          className="card-grid-equal hidden md:grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {stylists.map((stylist, i) => (
            <StaggerItem
              key={stylist.name}
              variant={CARD_VARIANTS[i % CARD_VARIANTS.length]}
              className="h-full"
            >
              <StylistCard stylist={stylist} />
            </StaggerItem>
          ))}
        </StaggerReveal>

        <p className="text-center text-curly-muted text-[11px] tracking-[0.18em] uppercase mt-4 md:hidden">
          Swipe to meet the team
        </p>
      </div>
    </section>
  );
}
