// Marketing content: services, differentiators, reviews. Brand-consistent copy
// carried over from the existing Love You sites, cleaned up for the unified brand.

export interface Service {
  name: string;
  description: string;
}

export const SERVICES: Service[] = [
  {
    name: "Russian E-File Manicure",
    description:
      "Our signature dry manicure — precise, painless cuticle work with a flawless, long-lasting finish.",
  },
  {
    name: "Smart Pedicure",
    description:
      "A meticulous, hygienic pedicure that leaves feet soft, healthy and beautifully groomed.",
  },
  {
    name: "Gel & Shellac",
    description:
      "High-shine, chip-resistant color that stays perfect for weeks, in a palette of premium shades.",
  },
  {
    name: "Nail Art & Design",
    description:
      "From elegant French to bold, intricate art — custom designs by art-forward technicians.",
  },
  {
    name: "Nail Extensions",
    description:
      "Natural-looking length and strength, sculpted and shaped to suit your style.",
  },
  {
    name: "Spa Add-Ons",
    description:
      "Elevate any service with nourishing masks, massage and treatments for hands and feet.",
  },
];

export interface Advantage {
  title: string;
  description: string;
}

export const ADVANTAGES: Advantage[] = [
  {
    title: "Medical-Grade Sterility",
    description:
      "Disposable or fully sterilized tools for every single service — cleanliness you can see.",
  },
  {
    title: "Master Technicians",
    description:
      "Highly experienced artists with a refined, design-forward sensibility.",
  },
  {
    title: "Eco-Safe Products",
    description: "Non-toxic, cruelty-free materials chosen for your health and comfort.",
  },
  {
    title: "An Elevated Experience",
    description:
      "A calm, beautiful space designed so every visit feels like a small escape.",
  },
];

export interface MembershipTier {
  key: "gold" | "diamond" | "vip";
  name: string;
  tagline: string;
  perks: string[];
  invitationOnly?: boolean;
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    key: "gold",
    name: "Gold",
    tagline: "Perfect for maintaining your beauty routine with added savings.",
    perks: [
      "10% off every service",
      "Complimentary nail fix within 10 days of your appointment",
    ],
  },
  {
    key: "diamond",
    name: "Diamond",
    tagline: "Elevated perks for clients who want the ultimate Love You experience.",
    perks: [
      "15% off every service",
      "Complimentary nail fix within 2 weeks of your appointment",
    ],
  },
  {
    key: "vip",
    name: "VIP",
    tagline: "Our most exclusive tier — by invitation only.",
    perks: ["By invitation only", "Individual, personalized terms"],
    invitationOnly: true,
  },
];

export interface Review {
  name: string;
  quote: string;
  /** Real customer photo (from the brand's own testimonials). */
  avatar?: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Olivia R.",
    avatar: "/media/reviews/olivia.jpg",
    quote:
      "I've tried so many nail salons, but I've never experienced this level of attention to detail. Everything feels premium, from cleanliness to comfort. My manicure lasts weeks and still looks brand new!",
  },
  {
    name: "Anna K.",
    avatar: "/media/reviews/anna.webp",
    quote:
      "I feel completely safe here — the tools are sterilized to medical standards, and it's immediately noticeable. The cuticle work is flawless, painless, and precise. I wouldn't trust my nails to anyone else now.",
  },
  {
    name: "Sofia M.",
    avatar: "/media/reviews/sofia.jpg",
    quote:
      "This place is more than just a salon. The atmosphere is wonderful: a beautiful interior and calming music help me relax. Every visit leaves me with only positive impressions.",
  },
  {
    name: "Natalie C.",
    avatar: "/media/reviews/natalie.webp",
    quote:
      "I tried dozens of salons before finding Love You. Everything — from the service to the technique and the atmosphere — is on another level. Now I know my nails will always look flawless.",
  },
  {
    name: "Jessica L.",
    avatar: "/media/reviews/jessica.webp",
    quote:
      "I was nervous about trying a Russian e-file manicure, but here I finally did — and I'm obsessed. It was completely painless, and the cuticle work was maximally neat. I can't imagine going back.",
  },
  {
    name: "Emily T.",
    avatar: "/media/reviews/emily.jpg",
    quote:
      "Every visit feels like a little escape from my busy schedule. The technicians are always gentle and professional, and I leave not only with perfect nails but also in a wonderful mood.",
  },
];
