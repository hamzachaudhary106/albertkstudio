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
  bookingUrl: "#booking",
  bookingConfirmNote: "Our team will confirm your appointment within 24 hours.",
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
    "Whether it's your first balayage or a complete transformation, Albert, Christine, and Elena treat every chair like a collaboration. You leave with hair that fits your life and your standards.",
  ],
};

export const signatureWork = {
  label: "Signature Work",
  title: "Color Crafted in the Chair",
  description:
    "Dimensional blondes, seamless balayage, and polished finishes from our Aventura studio. Explore the portfolio for more.",
  image: images.gallery.platinumBlonde,
  imageAlt: "Platinum blonde color work at Albert K Studio, Aventura",
  caption: "Custom platinum blonde",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Team", href: "#team" },
  { label: "Reviews", href: "#reviews" },
  { label: "Book", href: "#booking" },
];

export const services = [
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
  {
    id: "christine",
    name: "Christine",
    role: "Senior Color Specialist",
    specialty: "Balayage · Dimensional Blonde",
    bio: "Known for the most natural, luminous blondes in Aventura. Christine's balayage work is seamless, sun kissed, and always customized to your skin tone.",
    image: null,
    initials: "C",
  },
  {
    id: "elena",
    name: "Elena",
    role: "Styling Specialist",
    specialty: "Blowouts · Event Styling",
    bio: "The finishing touch expert. Elena's blowouts and event styling give every look that polished, camera ready finish clients love.",
    image: null,
    initials: "E",
  },
];

export const bookingStylists = [
  { id: "any", name: "No Preference" },
  ...stylists.map((s) => ({ id: s.id, name: s.name })),
];

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

export const faqs = [
  {
    question: "How does online booking work?",
    answer:
      "Select your date, time, and service to submit a request. Our team will call or text within 24 hours to confirm your appointment. For immediate booking, call (917) 657-8170.",
  },
  {
    question: "Do I need an appointment?",
    answer:
      "We recommend booking ahead to secure your preferred stylist. Walk ins are welcome when availability permits.",
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
