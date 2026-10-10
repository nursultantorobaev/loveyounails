import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { MARKETS } from "@/lib/locations";
import { languageAlternates, pageUrl } from "@/lib/seo";
import { allStudioPages } from "@/lib/studios";

// Every public page × every language, with hreflang alternates so Google links the
// en/ru/es versions of the same page instead of treating them as duplicates.
const PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/locations", priority: 0.9, changeFrequency: "monthly" },
  ...MARKETS.filter((m) => !m.comingSoon).map((m) => ({
    path: `/locations/${m.slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  })),
  ...allStudioPages().map(({ market, salon }) => ({
    path: `/locations/${market.slug}/${salon.slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  })),
  { path: "/memberships", priority: 0.8, changeFrequency: "monthly" },
  { path: "/gift-cards", priority: 0.7, changeFrequency: "monthly" },
  { path: "/group-bookings", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sterilization", priority: 0.7, changeFrequency: "yearly" },
  { path: "/shop", priority: 0.6, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.6, changeFrequency: "weekly" },
  { path: "/memberships/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/salon-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap((p) =>
    routing.locales.map((locale) => ({
      url: pageUrl(locale, p.path),
      lastModified,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      alternates: { languages: languageAlternates(p.path) },
    })),
  );
}
