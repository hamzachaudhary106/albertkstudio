import { images } from "./images";

export const business = {
  name: "Albert K Studio",
  tagline: "5 Star Rated Luxury Hair Salon",
  subTagline: "Master color and styling in the heart of Town Center Aventura",
  locationTag: "aventura • florida",
  since: "est. 2009",
  phone: "(917) 657-8170",
  phoneHref: "tel:+19176578170",
  email: "info@albertkstudio.com",
  address: "19020 NE 29th Ave, Aventura, FL 33180",
  addressShort: "Town Center Aventura",
  googleRating: 5.0,
  reviewCount: 142,
  bookingUrl: "/book",
  bookingConfirmNote:
    "This is a request only — not a confirmed appointment. We'll call or text within 24 hours to confirm.",
  depositNote:
    "A deposit confirms your appointment and is applied to your final bill. Cancellations within 24 hours may forfeit the deposit.",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=19020+NE+29th+Ave,+Aventura,+FL+33180&hl=en&z=15&output=embed",
  instagramUrl: "https://www.instagram.com/albertkstudio/",
  instagramHandle: "@albertkstudio",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Albert+K+Studio+19020+NE+29th+Ave+Aventura+FL+33180",
};

export const hero = {
  eyebrow: "Town Center Aventura · Since 2009",
  titleLine1: "Where Color Becomes",
  titleAccent: "Art",
  titleLine2: "in Aventura",
  subtitle:
    "I opened Albert K Studio to do one thing exceptionally well: create hair that looks expensive, feels effortless, and lasts. From platinum blondes to seamless keratin, every visit is personal.",
};

export const about = {
  heading: "A Salon Built on Craft, Not Trends",
  pullQuote:
    "We don't rush appointments. We listen, consult, and create hair you're proud to wear every day.",
  paragraphs: [
    "Albert K Studio sits in Town Center Aventura, a calm, luxury space where clients from Aventura, Sunny Isles, and across Miami Dade come for color work they can't get anywhere else.",
    "Whether it's your first balayage or a complete transformation, every chair is a collaboration with Albert and his team. You leave with hair that fits your life and your standards.",
  ],
};

export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  gallery: "/gallery",
  reviews: "/reviews",
  contact: "/contact",
  book: "/book",
  privacy: "/privacy",
  terms: "/terms",
} as const;

/** Primary navigation shown in the desktop header and mobile drawer. */
export const navLinks = [
  { label: "About", href: routes.about },
  { label: "Services", href: routes.services },
  { label: "Gallery", href: routes.gallery },
  { label: "Reviews", href: routes.reviews },
  { label: "Contact", href: routes.contact },
];

export const servicesSection = {
  description:
    "A selection of our most requested treatments. Every service starts with a consultation — times and pricing vary by hair length and condition.",
  allServicesUrl: "/services",
};

export const serviceDetailPath = (id: string) => `${routes.services}/${id}`;

export type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imagePosition: string;
  duration: string;
  priceNote: string;
  /** Longer body copy shown on the dedicated service page. */
  overview: string[];
  /** What's included with the service. */
  includes: string[];
  /** Step-by-step of what to expect in the chair. */
  process: { title: string; text: string }[];
  /** Who the service is best suited for. */
  idealFor: string;
};

export const services: Service[] = [
  {
    id: "keratin",
    title: "Keratin Treatment",
    tagline: "Silky, frizz free hair for weeks.",
    description:
      "Professional keratin smoothing that restores shine and manageability without weighing hair down.",
    image: images.services.keratin,
    imagePosition: "object-top",
    duration: "2.5 to 3 hrs",
    priceNote: "From $350",
    overview: [
      "Our keratin smoothing treatment infuses the hair with a protein that fills in damaged, porous areas and relaxes frizz from the inside out. The result is hair that's noticeably smoother, shinier, and far easier to style — without looking flat or losing its natural movement.",
      "Depending on your hair type and home care, results typically last two to four months. We tailor the strength of the treatment to your goals, whether you want a subtle softening or a fully sleek finish.",
    ],
    includes: [
      "Personalized consultation and strand assessment",
      "Clarifying treatment shampoo to prep the hair",
      "Keratin applied section by section and sealed with heat",
      "Smooth blow-dry and flat-iron finish",
      "Take-home aftercare guidance to extend your results",
    ],
    process: [
      { title: "Consultation", text: "We assess your texture, history, and goals to choose the right formula and strength." },
      { title: "Prep & Cleanse", text: "Hair is washed with a clarifying shampoo to open the cuticle and remove buildup." },
      { title: "Application", text: "The keratin is worked through in fine sections and sealed in with controlled heat." },
      { title: "Finish & Aftercare", text: "We blow-dry and flat-iron to lock in the smoothing, then walk you through home care." },
    ],
    idealFor: "Frizzy, coarse, or unruly hair — and anyone who wants faster, easier styling.",
  },
  {
    id: "hair-botox",
    title: "Hair Botox",
    tagline: "Deep repair with a smooth, healthy finish.",
    description:
      "A restorative treatment that conditions, repairs damage, and rejuvenates tired strands with no harsh chemicals.",
    image: images.services.hairBotox,
    imagePosition: "object-[center_15%]",
    duration: "2 to 2.5 hrs",
    priceNote: "From $280",
    overview: [
      "Hair botox is a deep-conditioning, restorative treatment — not an actual injectable. It coats each strand with a rich blend of proteins, vitamins, and bond-building ingredients that fill in breakage, smooth the surface, and bring back softness and shine.",
      "Unlike keratin, hair botox is formaldehyde-free and focused on repair, making it a gentle choice for hair that feels dry, brittle, or over-processed. You'll leave with healthier-looking, more manageable hair and a beautiful, glassy finish.",
    ],
    includes: [
      "Consultation and condition assessment",
      "Gentle cleanse to prepare the hair",
      "Bond-building botox treatment applied throughout",
      "Processing time for deep penetration and repair",
      "Smooth blow-dry finish and home care tips",
    ],
    process: [
      { title: "Consultation", text: "We evaluate damage and porosity to confirm botox is the right repair for your hair." },
      { title: "Cleanse", text: "Hair is gently washed to remove residue so the treatment can absorb fully." },
      { title: "Treatment", text: "The repairing formula is applied and left to penetrate and rebuild the strand." },
      { title: "Finish", text: "We rinse, blow-dry, and reveal a smoother, healthier, high-shine result." },
    ],
    idealFor: "Dry, damaged, or over-processed hair that needs repair and shine — chemical-free.",
  },
  {
    id: "haircuts-coloring",
    title: "Haircuts & Color",
    tagline: "Blonde, balayage, and cuts tailored to you.",
    description:
      "From precision cuts to dimensional blondes and lived in balayage, crafted for your face, lifestyle, and style.",
    image: images.services.haircuts,
    imagePosition: "object-[center_35%]",
    duration: "1.5 to 4 hrs",
    priceNote: "From $150",
    overview: [
      "Whether you're after a precision cut, a refreshed root, or a complete color transformation, every service is built around your face shape, hair texture, and lifestyle. Albert specializes in dimensional blondes, lived-in balayage, and seamless color corrections that grow out beautifully.",
      "We never rush the chair. From consultation to the final blow-dry, we focus on getting the tone, placement, and shape exactly right — and on keeping your hair healthy through every step.",
    ],
    includes: [
      "In-depth consultation and color mapping",
      "Precision cut shaped to your features",
      "Custom color, highlights, or hand-painted balayage",
      "Gloss or toner to perfect your tone",
      "Blow-dry finish and at-home styling guidance",
    ],
    process: [
      { title: "Consultation", text: "We talk through inspiration, tone, and maintenance to design your look together." },
      { title: "Color", text: "Color, highlights, or balayage are applied and processed for the perfect dimension." },
      { title: "Cut & Shape", text: "Your cut is tailored to your features, texture, and the way you wear your hair." },
      { title: "Gloss & Finish", text: "We tone, gloss, and style — then show you how to recreate it at home." },
    ],
    idealFor: "Anyone refreshing their look — from a clean cut to a full dimensional blonde.",
  },
  {
    id: "extensions",
    title: "Premium Extensions",
    tagline: "Length and volume, blended to perfection.",
    description:
      "100% human hair extensions applied and blended by specialists for natural movement and seamless color match.",
    image: images.services.extensions,
    imagePosition: "object-top",
    duration: "2 to 3 hrs",
    priceNote: "From $450",
    overview: [
      "Add length, fullness, or volume with premium 100% human hair extensions, custom color-matched and applied by specialists. We offer tape-in and hand-tied methods, choosing the right approach for your hair type, lifestyle, and goals.",
      "The secret is in the blend: extensions are cut and styled into your own hair so they move naturally and disappear seamlessly. We'll also set you up with a simple maintenance plan to keep them looking flawless.",
    ],
    includes: [
      "Complimentary consultation and custom color match",
      "Method selection — tape-in or hand-tied wefts",
      "Professional application and secure placement",
      "Cut and blend into your natural hair",
      "Maintenance and home-care plan",
    ],
    process: [
      { title: "Consultation", text: "We match color, assess your hair, and recommend the best method and amount of hair." },
      { title: "Color Match", text: "Extensions are selected and, if needed, customized for a flawless blend." },
      { title: "Application", text: "Wefts are applied securely and comfortably for natural movement." },
      { title: "Cut & Blend", text: "We cut and style everything together so the extensions disappear into your hair." },
    ],
    idealFor: "Adding length, fullness, or volume with a seamless, natural finish.",
  },
];

export const workingHours = [
  { day: "Monday to Sunday", hours: "10AM to 6PM" },
];

export const gallery = {
  heading: "Our Work",
  description: "Color, cuts, and styling from the chair. Tap any image to view full size.",
  items: [
    {
      image: images.gallery.platinumBlonde,
      title: "Platinum Blonde",
      category: "Color",
      featured: true,
    },
    {
      image: images.gallery.balayageCurls,
      title: "Caramel Balayage & Curls",
      category: "Balayage",
    },
    {
      image: images.gallery.dimensionalBlonde,
      title: "Dimensional Blonde",
      category: "Highlights",
    },
    {
      image: images.gallery.copperRed,
      title: "Copper Red Color",
      category: "Color",
    },
    {
      image: images.gallery.ashBlondeWaves,
      title: "Ash Blonde Waves",
      category: "Color & Style",
    },
    {
      image: images.gallery.glamourWaves,
      title: "Glamour Waves",
      category: "Styling",
    },
    {
      image: images.gallery.volumeBlowout,
      title: "Volume Blowout",
      category: "Blowout",
    },
    {
      image: images.gallery.sleekBrunette,
      title: "Sleek Brunette",
      category: "Cut & Style",
    },
    {
      image: images.gallery.texturedLob,
      title: "Textured Lob",
      category: "Cut & Color",
    },
  ],
};

const teamHeadshot = images.team.headshot;

export const stylists = [
  {
    id: "albert",
    name: "Albert K",
    role: "Founder & Master Stylist",
    specialty: "Platinum Blonde · Cuts · Transformations",
    bio: "15+ years mastering color correction, platinum blondes, and full transformations. Albert's clients return because the results last and the experience feels personal.",
    image: teamHeadshot,
  },
];

export const bookingStylists = stylists.map((s) => ({ id: s.id, name: s.name }));

export const teamSection = {
  label: "The Artist",
  title: "Meet Albert K",
  description:
    "Founder and master stylist. Albert leads every transformation with the precision and personal attention that built this studio's reputation in Aventura.",
};

export const reviewsSection = {
  heading: "What Our Clients Say",
  description: "142 five star Google reviews from clients across Aventura and South Florida.",
};

export const featuredReview = {
  name: "Roxanna Music",
  date: "3 months ago",
  text: "Albert K Studio in Aventura was hands down one of the most amazing salon experiences I've ever had. Albert is truly exceptional. He colored my hair perfectly.",
};

export const reviews = [
  {
    name: "Angie Tang",
    date: "1 month ago",
    text: "I have been coming to Albert K Studio for soooo many years honestly, I don't even remember. I love it every time, everyone is super nice and extremely talented.",
    verified: true,
  },
  {
    name: "Rachel Honig",
    date: "2 weeks ago",
    text: "I've been getting my hair done with the team for years. There is truly no one better! Love this salon and the atmosphere is always so welcoming.",
    verified: true,
  },
  {
    name: "Jennifer Elizabeth",
    date: "4 months ago",
    text: "Albert is the best hair dresser & all the staff is incredible! You can't go wrong! My hair has never looked healthier or more vibrant.",
    verified: true,
  },
];

export const serviceMenu = [
  {
    category: "Color",
    note: "Pricing varies with hair length, density, and the look you're after. Final quote confirmed at consultation.",
    items: [
      { name: "Single Process Color", detail: "All-over root or refresh color", price: "From $120" },
      { name: "Partial Highlights", detail: "Brightness around the face and crown", price: "From $180" },
      { name: "Full Highlights", detail: "Dimension throughout", price: "From $240" },
      { name: "Balayage / Ombré", detail: "Hand-painted, lived-in blonde", price: "From $250" },
      { name: "Platinum / Color Correction", detail: "Consultation required", price: "From $350" },
      { name: "Toner / Gloss", detail: "Shine and tone refresh", price: "From $65" },
    ],
  },
  {
    category: "Cuts & Styling",
    note: "Every cut includes a consultation, shampoo, and finish.",
    items: [
      { name: "Women's Cut & Style", detail: "Precision cut tailored to you", price: "From $85" },
      { name: "Men's Cut", detail: "Clipper or scissor cut", price: "From $55" },
      { name: "Blowout", detail: "Smooth or voluminous finish", price: "From $65" },
      { name: "Special Occasion Updo", detail: "Events, weddings, photoshoots", price: "From $120" },
      { name: "Bang / Fringe Trim", detail: "Between-visit touch-up", price: "From $25" },
    ],
  },
  {
    category: "Smoothing & Treatments",
    note: "Restorative services for healthier, more manageable hair.",
    items: [
      { name: "Keratin Treatment", detail: "Frizz-free, silky for weeks", price: "From $350" },
      { name: "Hair Botox", detail: "Deep repair and smooth finish", price: "From $280" },
      { name: "Olaplex Bond Repair", detail: "Add-on strengthening treatment", price: "From $45" },
      { name: "Deep Conditioning Mask", detail: "Intensive moisture", price: "From $35" },
    ],
  },
  {
    category: "Extensions",
    note: "100% human hair, applied and color-matched by specialists. Hair cost quoted separately.",
    items: [
      { name: "Extension Consultation", detail: "Custom plan and color match", price: "Complimentary" },
      { name: "Tape-In Application", detail: "Seamless, lightweight volume", price: "From $450" },
      { name: "Hand-Tied Wefts", detail: "Natural movement and fullness", price: "From $650" },
      { name: "Maintenance / Move-Up", detail: "Every 6–8 weeks", price: "From $200" },
    ],
  },
];

export const serviceMenuNote =
  "All prices are starting points. Because color and condition are unique to every guest, your exact quote is confirmed during a complimentary consultation. Prices do not include applicable tax or gratuity.";

export const aboutValues = [
  {
    title: "Consultation First",
    description:
      "Every visit begins with a real conversation. We listen to your goals, assess your hair, and set honest expectations before we start.",
  },
  {
    title: "Craft Over Trends",
    description:
      "We build looks around your face, lifestyle, and hair health — not whatever is trending this week — so the result still looks right months later.",
  },
  {
    title: "Hair Health",
    description:
      "Bond builders, quality color, and careful technique keep your hair strong through every transformation, including blondes and color corrections.",
  },
  {
    title: "An Unhurried Experience",
    description:
      "We don't double-book or rush the chair. Your appointment is your time, in a calm, luxury space in the heart of Aventura.",
  },
];

export const contactCopy = {
  eyebrow: "Get in Touch",
  title: "Visit Albert K Studio",
  description:
    "Questions about a service, color consultation, or extensions? Send us a note or call the studio — we typically reply within 24 hours.",
  formNote:
    "This form sends an inquiry only. For the fastest response, or to confirm an appointment, please call the studio directly.",
  inquiryTypes: [
    "General Question",
    "Color Consultation",
    "Extensions",
    "Keratin / Smoothing",
    "Appointment Request",
    "Other",
  ],
};

export const pageMeta = {
  about: {
    eyebrow: "Our Story",
    title: "A Salon Built on Craft",
    description:
      "Get to know Albert K Studio — a luxury hair salon in Town Center Aventura founded on consultation, craft, and lasting results.",
  },
  services: {
    eyebrow: "Services & Pricing",
    title: "What We Do Best",
    description:
      "Color, cuts, smoothing treatments, and premium extensions — expertly crafted in Aventura. Explore our full service menu and pricing.",
  },
  gallery: {
    eyebrow: "Portfolio",
    title: "Our Work",
    description:
      "Real color, cuts, and styling from the chair at Albert K Studio in Aventura, Florida. Browse the gallery and tap any image to view full size.",
  },
  reviews: {
    eyebrow: "Reviews",
    title: "What Our Clients Say",
    description:
      "Five-star rated by clients across Aventura and South Florida. Read what guests say about their experience at Albert K Studio.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in Touch",
    description:
      "Visit Albert K Studio in Town Center Aventura. Find our address, hours, directions, phone, and send us a message.",
  },
  book: {
    eyebrow: "Appointments",
    title: "Book Your Visit",
    description:
      "Book an appointment at Albert K Studio in Aventura. Choose your service, date, and time, then secure your spot with a quick deposit.",
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    description: "How Albert K Studio collects, uses, and protects your personal information.",
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    description: "The terms that govern your use of the Albert K Studio website and services.",
  },
  notFound: {
    eyebrow: "404",
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has moved.",
  },
};

export const legalUpdated = "June 1, 2026";

export const privacyPolicy = [
  {
    heading: "Overview",
    body: [
      `This Privacy Policy explains how ${business.name} ("we," "us," or "our") collects, uses, and protects information when you visit our website or contact us to request an appointment. By using this site, you agree to the practices described here.`,
    ],
  },
  {
    heading: "Information We Collect",
    body: [
      "When you submit an appointment request or contact form, we collect the details you provide — such as your name, phone number, email address, and any message or service preferences. We may also collect basic, non-identifying analytics about how visitors use the site (such as pages viewed and device type).",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      "We use the information you provide solely to respond to your inquiry, confirm and manage appointments, and improve our services. We may contact you by phone, text, or email regarding your request. We do not sell or rent your personal information to third parties.",
    ],
  },
  {
    heading: "Cookies & Analytics",
    body: [
      "Our website may use cookies or similar technologies to remember your preferences and understand site usage. You can disable cookies in your browser settings, though some features may not function as intended.",
    ],
  },
  {
    heading: "Data Retention & Security",
    body: [
      "We retain inquiry and appointment information only as long as needed to serve you and meet legal or business requirements. We take reasonable measures to protect your information, but no method of transmission over the internet is fully secure.",
    ],
  },
  {
    heading: "Your Choices",
    body: [
      "You may request that we update or delete the personal information you've shared with us at any time by contacting the studio. You can also opt out of non-essential communications.",
    ],
  },
  {
    heading: "Contact Us",
    body: [
      `If you have questions about this Privacy Policy, contact us at ${business.email} or ${business.phone}. We may update this policy from time to time; the latest version will always be posted on this page.`,
    ],
  },
];

export const termsOfService = [
  {
    heading: "Acceptance of Terms",
    body: [
      `These Terms of Service govern your use of the ${business.name} website. By accessing or using this site, you agree to be bound by these terms. If you do not agree, please do not use the site.`,
    ],
  },
  {
    heading: "Appointments & Requests",
    body: [
      "Appointment requests submitted through this website are requests only and are not confirmed until we contact you to finalize the date, time, and service. Pricing shown is a starting point and is confirmed at consultation; final cost depends on hair length, condition, and the service performed.",
    ],
  },
  {
    heading: "Cancellations & Late Arrivals",
    body: [
      "We kindly ask that you give as much notice as possible if you need to cancel or reschedule. Late arrivals may result in a shortened service to respect other guests' appointments. Specific cancellation terms are confirmed when we book your visit.",
    ],
  },
  {
    heading: "Service Results",
    body: [
      "Hair results vary based on individual hair type, history, and home care. While we use professional products and techniques to achieve the best outcome, we cannot guarantee a specific result. We're always happy to discuss adjustments during your consultation.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      `All content on this website — including text, images, logos, and design — is the property of ${business.name} and may not be reproduced without permission.`,
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "This website is provided on an \"as is\" basis. We are not liable for any damages arising from your use of the site or reliance on its content. Links to third-party sites are provided for convenience and are not under our control.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about these terms? Reach us at ${business.email} or ${business.phone}. We may revise these terms at any time, and continued use of the site constitutes acceptance of the updated terms.`,
    ],
  },
];

export const faqs = [
  {
    question: "How does online booking work?",
    answer:
      "Choose your preferred date, time, and service to submit a request — not a confirmed booking. We'll call or text within 24 hours to confirm. To book immediately, call (917) 657-8170.",
  },
  {
    question: "Do I need an appointment?",
    answer:
      "We recommend requesting an appointment ahead of time. Walk ins are welcome when availability permits.",
  },
  {
    question: "Where is Albert K Studio located?",
    answer:
      "19020 NE 29th Ave, Town Center Aventura, FL 33180, with convenient parking near Biscayne Blvd and the Aventura Mall area.",
  },
  {
    question: "What services do you offer?",
    answer:
      "Keratin treatments, hair botox, precision cuts, color, balayage, highlights, premium extensions, blowouts, and personalized consultations.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We welcome clients from Aventura, Sunny Isles Beach, North Miami Beach, Golden Beach, Hallandale, Bal Harbour, Surfside, and greater Miami Dade.",
  },
];
