// SEO helpers: per-page titles/descriptions in the page's language (messages "Seo"),
// canonical URL + hreflang alternates for en/ru/es, and schema.org JSON-LD for Google.
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { MARKETS, type DayHours, type Market, type Salon } from "@/lib/locations";

export const SITE_URL = "https://loveyou.club";
export const SITE_NAME = "Love You Nail Salon";

const OG_IMAGE = {
  url: "/media/photos/nails-nude-macro.png",
  width: 1948,
  height: 1596,
  alt: SITE_NAME,
};
const OG_LOCALE: Record<string, string> = { en: "en_US", ru: "ru_RU", es: "es_US" };

/** Absolute URL of a page in a locale, e.g. pageUrl("ru", "/memberships"). */
export const pageUrl = (locale: string, path = "") => `${SITE_URL}/${locale}${path}`;

/** hreflang map for a path: every locale + x-default (English). */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, pageUrl(l, path)])),
    "x-default": pageUrl(routing.defaultLocale, path),
  };
}

/**
 * Metadata for a page from messages "Seo.<key>.title|description" in its locale.
 * `path` is the route without the locale prefix ("" for home, "/memberships", …).
 */
export async function localizedMeta(locale: string, key: string, path: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Seo" });
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  const url = pageUrl(locale, path);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? "en_US",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

/* ------------------------------ JSON-LD ------------------------------ */

const DAY_URL: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

/** "9:00 AM" → "09:00" (schema.org wants 24-hour HH:MM). */
function to24h(time: string): string {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return time;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

function openingHours(hours: DayHours[]) {
  return hours
    .filter((h) => DAY_URL[h.day] && h.open && h.close)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_URL[h.day],
      opens: to24h(h.open),
      closes: to24h(h.close),
    }));
}

const ORG_ID = `${SITE_URL}/#organization`;

/** The brand: one organization with its Instagram profiles. */
export function organizationLd() {
  const sameAs = [...new Set(MARKETS.map((m) => m.instagram).filter(Boolean))];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-black.png`,
    sameAs,
  };
}

export function websiteLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: pageUrl(locale),
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

/** One NailSalon (LocalBusiness) per studio — address, phone, hours, booking link. */
function salonLd(market: Market, salon: Salon, locale: string) {
  const url = `${pageUrl(locale, `/locations/${market.slug}`)}#${salon.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    "@id": `${SITE_URL}/locations/${market.slug}#${salon.slug}`,
    name: `${SITE_NAME} — ${salon.name}`,
    url,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    logo: `${SITE_URL}/brand/logo-black.png`,
    telephone: salon.phones[0],
    email: market.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: salon.address,
      addressLocality: salon.city,
      addressRegion: salon.state,
      postalCode: salon.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: openingHours(salon.hours),
    ...(market.instagram ? { sameAs: [market.instagram] } : {}),
    ...(salon.bookingUrl
      ? {
          potentialAction: {
            "@type": "ReserveAction",
            target: salon.bookingUrl,
            result: { "@type": "Reservation", name: "Nail appointment" },
          },
        }
      : {}),
    parentOrganization: { "@id": ORG_ID },
  };
}

export function marketSalonsLd(market: Market, locale: string) {
  return market.comingSoon ? [] : market.salons.map((s) => salonLd(market, s, locale));
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}
