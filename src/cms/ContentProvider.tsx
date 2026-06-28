import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isBookingConfigured } from "../lib/supabase";
import {
  about as aboutDefault,
  business as businessDefault,
  faqs as faqsDefault,
  featuredReview as featuredReviewDefault,
  gallery as galleryDefault,
  hero as heroDefault,
  navLinks as navLinksDefault,
  reviews as reviewsDefault,
  services as servicesDefault,
  stylists as stylistsDefault,
  workingHours as workingHoursDefault,
  type Service,
} from "../data/content";

type GalleryItem = { image: string; title: string; category: string; featured?: boolean };
type Stylist = { id: string; name: string; role: string; specialty: string; bio: string; image: string };
type Review = { name: string; date: string; text: string; verified?: boolean };
type Faq = { question: string; answer: string };
type NavLink = { label: string; href: string };
type WorkingHour = { day: string; hours: string };

export type SiteContent = {
  business: typeof businessDefault;
  hero: typeof heroDefault;
  about: typeof aboutDefault;
  navLinks: NavLink[];
  workingHours: WorkingHour[];
  services: Service[];
  galleryItems: GalleryItem[];
  stylists: Stylist[];
  featuredReview: Review;
  reviews: Review[];
  faqs: Faq[];
};

const defaults: SiteContent = {
  business: businessDefault,
  hero: heroDefault,
  about: aboutDefault,
  navLinks: navLinksDefault,
  workingHours: workingHoursDefault,
  services: servicesDefault,
  galleryItems: galleryDefault.items,
  stylists: stylistsDefault,
  featuredReview: featuredReviewDefault,
  reviews: reviewsDefault,
  faqs: faqsDefault,
};

const ContentContext = createContext<SiteContent>(defaults);

function durationLabel(minutes: number): string {
  const h = minutes / 60;
  const val = Number.isInteger(h) ? `${h}` : h.toFixed(1).replace(/\.0$/, "");
  return `${val} hrs`;
}

function mapService(row: Record<string, unknown>): Service {
  return {
    id: String(row.slug),
    title: String(row.title ?? ""),
    tagline: String(row.tagline ?? ""),
    description: String(row.description ?? ""),
    image: String(row.image_url ?? ""),
    imagePosition: String(row.image_position ?? "object-center"),
    duration: durationLabel(Number(row.duration_min ?? 0)),
    priceNote: String(row.price_label ?? ""),
    overview: (row.overview as string[]) ?? [],
    includes: (row.includes as string[]) ?? [],
    process: (row.process as { title: string; text: string }[]) ?? [],
    idealFor: String(row.ideal_for ?? ""),
  };
}

async function loadContent(): Promise<SiteContent> {
  const [settingsRes, servicesRes, galleryRes, teamRes, reviewsRes, faqsRes] = await Promise.all([
    supabase.from("site_settings").select("key,value"),
    supabase.from("services").select("*").eq("active", true).order("sort"),
    supabase.from("gallery_items").select("*").eq("active", true).order("sort"),
    supabase.from("team_members").select("*").eq("active", true).order("sort"),
    supabase.from("reviews").select("*").eq("active", true).order("sort"),
    supabase.from("faqs").select("*").eq("active", true).order("sort"),
  ]);

  const next: SiteContent = { ...defaults };

  const settings = new Map((settingsRes.data ?? []).map((r) => [r.key, r.value]));
  if (settings.get("business")) next.business = { ...defaults.business, ...(settings.get("business") as object) };
  if (settings.get("hero")) next.hero = { ...defaults.hero, ...(settings.get("hero") as object) };
  if (settings.get("about")) next.about = { ...defaults.about, ...(settings.get("about") as object) };
  if (settings.get("nav")) next.navLinks = settings.get("nav") as NavLink[];
  if (settings.get("hours")) next.workingHours = settings.get("hours") as WorkingHour[];

  if (servicesRes.data?.length) next.services = servicesRes.data.map(mapService);
  if (galleryRes.data?.length) {
    next.galleryItems = galleryRes.data.map((r) => ({
      image: r.image_url,
      title: r.title,
      category: r.category ?? "",
      featured: r.featured ?? false,
    }));
  }
  if (teamRes.data?.length) {
    next.stylists = teamRes.data.map((r) => ({
      id: r.slug ?? r.id,
      name: r.name,
      role: r.role ?? "",
      specialty: r.specialty ?? "",
      bio: r.bio ?? "",
      image: r.image_url ?? "",
    }));
  }
  if (reviewsRes.data?.length) {
    const featured = reviewsRes.data.find((r) => r.featured) ?? reviewsRes.data[0];
    next.featuredReview = { name: featured.name, date: featured.date_label ?? "", text: featured.text };
    next.reviews = reviewsRes.data
      .filter((r) => r.id !== featured.id)
      .map((r) => ({ name: r.name, date: r.date_label ?? "", text: r.text, verified: true }));
  }
  if (faqsRes.data?.length) {
    next.faqs = faqsRes.data.map((r) => ({ question: r.question, answer: r.answer }));
  }

  return next;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaults);

  useEffect(() => {
    if (!isBookingConfigured) return;
    let active = true;
    loadContent()
      .then((c) => {
        if (active) setContent(c);
      })
      .catch(() => {
        /* keep code defaults on any failure */
      });
    return () => {
      active = false;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

/** Access CMS-managed site content (falls back to code defaults until loaded). */
export function useContent(): SiteContent {
  return useContext(ContentContext);
}
