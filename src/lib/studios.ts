// Per-studio pages (/locations/<market>/<studio>) exist only for cities with several
// studios — for a one-studio city the city page already is the studio page.
import { MARKETS, type Market, type Salon } from "@/lib/locations";

export const hasStudioPages = (m: Market) => !m.comingSoon && m.salons.length > 1;

export function getStudio(marketSlug: string, studioSlug: string): { market: Market; salon: Salon } | undefined {
  const market = MARKETS.find((m) => m.slug === marketSlug);
  if (!market || !hasStudioPages(market)) return undefined;
  const salon = market.salons.find((s) => s.slug === studioSlug);
  return salon ? { market, salon } : undefined;
}

/** Path (no locale) of a studio's own page, or of its city page for one-studio cities. */
export function studioPath(market: Market, salon: Salon): string {
  return hasStudioPages(market) ? `/locations/${market.slug}/${salon.slug}` : `/locations/${market.slug}`;
}

export const allStudioPages = () =>
  MARKETS.filter(hasStudioPages).flatMap((m) => m.salons.map((s) => ({ market: m, salon: s })));

// Popular services with the city's prices (same numbers the AI agents quote from
// Square). Names come from messages "Prices.items.<id>.name".
export const POPULAR_SERVICES: Record<string, { id: string; price: number; from: boolean }[]> = {
  chicago: [
    { id: "russian-gel-mani", price: 90, from: true },
    { id: "hard-gel-mani", price: 120, from: true },
    { id: "russian-gel-pedi", price: 90, from: true },
    { id: "regular-mani", price: 60, from: false },
    { id: "combo-russian-smart", price: 210, from: false },
    { id: "gel-extension", price: 180, from: true },
  ],
};
