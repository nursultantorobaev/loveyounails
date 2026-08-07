# Love You Nail Salon — Unified Brand Website

A single, premium brand website that unifies all **Love You Nail Salon** locations
under one identity while each location keeps its own operations and booking system.

> Independent project. Not affiliated with or dependent on any other codebase.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS `@theme` tokens in `src/app/globals.css`)
- **next/font** — Cormorant Garamond (display serif) + Montserrat (body)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 (this repo's dev preview has been run on 3005 during setup).

## Brand

- Official logo (`public/brand/`): `logo-{gold,black}.png` (full lockup) and
  `mark-{gold,black}.png` (monogram). Black on light, gold on dark. Rendered via
  `components/Wordmark.tsx`; gold mark is the favicon.
- Palette: cream / ivory, champagne **gold** accents, warm espresso brown text.
- Voice: modern, premium, luxury, clean, friendly.

## Architecture

Locations are the core data model — **markets contain multiple salons**.

- `src/lib/locations.ts` — `MARKETS` (source of truth) + helpers (`getMarket`,
  `mapsUrl`, `bookingHref`). Add a location by adding an object; pages update
  automatically.
- `src/lib/content.ts` — services, advantages, reviews copy.
- `src/lib/pricing.ts` — categorized brand price list (verified identical on SM +
  NY sites; Chicago publishes no prices, inherits this until confirmed).
- `src/components/` — `Header`, `Footer`, `Wordmark`, `SalonCard`, `ui/Button`,
  `ui/ImagePlaceholder`.
- `src/app/page.tsx` — home: **full-bleed video hero** (`/media/hero.mp4`) with
  scrim, about, full-bleed statement band, service feature rows, portfolio grid,
  locations preview, why-us, memberships, reviews, CTA. Apple-style: big type,
  generous spacing, scroll-reveal (`components/Reveal.tsx`).
- `public/media/` — real brand assets reused from the client's existing sites:
  `hero.mp4` (intro video) + curated nail photos in `photos/`. Served via
  `next/image`.
- `src/app/locations/` — index + `[market]` detail pages (`generateStaticParams`).
- `src/app/prices/` — Services & Pricing page (from `pricing.ts`).
- `src/app/memberships/` — Gold / Diamond / VIP tiers, "how it works", gift
  cards. Per-city purchase links live in `locations.ts` (`membership`,
  `giftCardUrl`); membership is tied to its city.
  - **Agreement gate:** every "Join" (Gold/Diamond, all cities) opens
    `components/MembershipJoin.tsx` — a modal with the full T&C
    (`lib/membershipTerms.ts`); customer must tick acknowledgment before
    "Agree & Continue" opens checkout. Full terms at `/memberships/terms` +
    `public/membership-terms.pdf`. NOTE: consent is a front-end gate only (no
    backend record of acceptance).
- `src/app/(legal)/` — Privacy Policy + Salon Policy (real content, via
  `components/Policy.tsx`).
- `src/app/shop/` — product line preview: 5 sample products from
  `lib/products.ts`, "coming soon" state (no checkout yet), brand line-art
  illustrations (`components/ProductImage.tsx`). Home teaser + nav/footer links.

### Booking (location-specific by design)

Each salon carries its own `bookingUrl`. The Book button deep-links out to that
salon's system:

| Market        | Booking system      | Status                         |
| ------------- | ------------------- | ------------------------------ |
| Chicago       | Square Appointments | ✅ 5 salons, per-salon deep-links |
| New York      | Square Appointments | ✅ Manhattan, deep-link          |
| Santa Monica  | Fresha              | ✅ live deep-link                |

When a salon has no `bookingUrl` yet, the button falls back to **Call to Book**
(`tel:`).

## Status — MVP built (2026-08-06)

Home + Locations (Chicago 5 studios, New York 1, Santa Monica 1) +
per-location pages + deep-link/redirect booking (all 7 salons wired) + reviews +
policies. Verified in-browser, responsive, no console errors.

## TODO — resume list (updated 2026-08-07)

Site is fully built, trilingual (EN/RU/ES), deployed (loveyou-nails.vercel.app)
and on GitHub. Remaining:

**Needs client input / decision**
- [ ] Confirm **New York gift-card link** (used `MLQ7DM9VW6BZ0`; old NY site had a
      conflicting one, `ML14XS3Q5DCGJ`, which is actually Santa Monica's). See
      `src/lib/locations.ts` → new-york `giftCardUrl`.
- [ ] **Legal review** of the RU/ES Membership T&C + Privacy + Salon policies by a
      native speaker / lawyer (machine-translated; in `messages/{ru,es}.json`
      under `Terms` / `Privacy` / `Salon`).
- [ ] Confirm **Chicago pricing** (Chicago publishes none → inherits SM/NY list).
- [ ] Distinct **per-location emails** if they exist (only one shared gmail found).

**Production-grade / features**
- [ ] Real **product line**: names/photos/prices + real **checkout**
      (Square/Stripe/Shopify). `/shop` is a "coming soon" preview (`src/lib/products.ts`).
- [ ] **Custom domain** (e.g. loveyounails.com) → point at Vercel.
- [ ] **Membership consent record** — the T&C gate is front-end only; a legal
      record of who/when accepted needs a backend/DB.

**Polish (optional)**
- [ ] Localized **Terms PDF** (on-page terms are translated;
      `public/membership-terms.pdf` still English-only).
- [ ] Real **studio/interior + team photos** (have nail close-ups + Wikimedia city photos).
- [ ] **Cutover plan**: retire the 3 old Tilda sites → point to this.
