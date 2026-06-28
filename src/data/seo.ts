import {
  business,
  faqs,
  featuredReview,
  reviews,
  services,
  workingHours,
} from "./content";

export const siteUrl = "https://albertkstudio.com";

export const geo = {
  latitude: 25.9569,
  longitude: -80.1415,
};

export const serviceAreas = [
  "Aventura",
  "Sunny Isles Beach",
  "North Miami Beach",
  "Golden Beach",
  "Hallandale Beach",
  "Hollywood",
  "Bal Harbour",
  "Surfside",
  "Biscayne Park",
  "North Miami",
];

export const localKeywords = [
  "hair salon Aventura",
  "luxury hair salon Aventura FL",
  "balayage Aventura",
  "keratin treatment Aventura",
  "hair color Aventura",
  "hair extensions Aventura",
  "best hair salon near me",
  "Town Center Aventura salon",
];

export const meta = {
  title: "Albert K Studio | Luxury Hair Salon in Aventura, FL",
  description:
    "Albert K Studio is a 5 star rated luxury hair salon in Aventura, FL. Expert cuts, balayage, keratin, hair botox & extensions at Town Center Aventura. Book your appointment today.",
  keywords: localKeywords.join(", "),
  ogImage: `${siteUrl}/hero-salon.png`,
  ogImageAlt:
    "Albert K Studio luxury hair salon interior in Aventura, Florida",
};

export const localSeoCopy = {
  heading: "Aventura's Premier Hair Salon",
  subheading: "Serving South Florida with luxury hair care",
  intro:
    "Albert K Studio is the destination for discerning clients seeking a luxury hair salon in Aventura, Florida. Conveniently located at Town Center Aventura on NE 29th Avenue, we welcome guests from across Miami Dade County.",
  servingLabel: "Areas We Serve",
  directionsLabel: "Get Directions",
  napLabel: "Visit Albert K Studio",
};

export const openingHoursSpec = [
  {
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "10:00",
    closes: "18:00",
  },
];

function parseAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: "19020 NE 29th Ave",
    addressLocality: "Aventura",
    addressRegion: "FL",
    postalCode: "33180",
    addressCountry: "US",
  };
}

export function buildLocalSchemas() {
  const hairSalon = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${siteUrl}/#salon`,
    name: business.name,
    description: meta.description,
    url: siteUrl,
    telephone: business.phone,
    email: business.email,
    image: meta.ogImage,
    logo: `${siteUrl}/logos/albert-logo-black.png`,
    priceRange: "$$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card",
    address: parseAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    hasMap: business.mapsUrl,
    areaServed: serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
      containedInPlace: {
        "@type": "State",
        name: "Florida",
      },
    })),
    openingHoursSpecification: openingHoursSpec.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.dayOfWeek,
      opens: spec.opens,
      closes: spec.closes,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.googleRating.toString(),
      reviewCount: business.reviewCount.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: [featuredReview, ...reviews.slice(0, 3)].map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewBody: review.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    })),
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@id": `${siteUrl}/#salon` },
        areaServed: {
          "@type": "City",
          name: "Aventura",
        },
      },
    })),
    sameAs: [business.mapsUrl, business.instagramUrl],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: business.name,
    url: siteUrl,
    description: meta.description,
    publisher: { "@id": `${siteUrl}/#salon` },
    inLanguage: "en-US",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
      { "@type": "ListItem", position: 3, name: "Book", item: `${siteUrl}/book` },
    ],
  };

  const localBusinessHours = workingHours
    .filter((h) => h.hours !== "Closed")
    .map((h) => h.day)
    .join(", ");

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#salon` },
    inLanguage: "en-US",
    specialty: `Luxury hair salon open ${localBusinessHours} in Aventura, Florida`,
  };

  return [hairSalon, website, webPage, faqPage, breadcrumb];
}
