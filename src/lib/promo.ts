// The site-wide promotion shown as a top bar + a one-time popup (see Promo.tsx).
// Text lives in messages/*.json under "Promo"; this file says WHERE it applies.
//
// To turn the promo off, set `enabled: false`. To launch a different one, change
// `id` too — visitors who closed the old popup will then see the new one.

import { MARKETS, type Salon } from "./locations";

export const PROMO = {
  enabled: true,
  id: "first-visit-20-sm", // bumped when Santa Monica joined, so the popup shows again
  /** Studios the offer is valid at, as [market slug, salon slug]. */
  salons: [
    ["new-york", "manhattan"],
    ["chicago", "downtown"],
    ["santa-monica", "2nd-street"],
  ] as const,
};

export interface PromoSalon {
  key: string; // "<market>/<salon>", for React keys + translation lookups
  salon: Salon;
}

export function promoSalons(): PromoSalon[] {
  return PROMO.salons.flatMap(([market, slug]) => {
    const salon = MARKETS.find((m) => m.slug === market)?.salons.find((s) => s.slug === slug);
    return salon ? [{ key: `${market}/${slug}`, salon }] : [];
  });
}
