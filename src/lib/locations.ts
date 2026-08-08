// Central source of truth for every Love You Nails market and salon.
// Booking stays location-specific (Square for Chicago/NY, Fresha for Santa Monica);
// each salon carries its own bookingUrl so the "Book" button just deep-links out.
//
// TODO (need from client): exact Square Appointments booking URLs per salon, and
// full New York location data (addresses / phones / booking links).

export type BookingSystem = "square" | "fresha";

export interface DayHours {
  day: string;
  open: string;
  close: string;
}

export interface Salon {
  slug: string;
  /** Neighborhood / short name, e.g. "West Loop" */
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phones: string[];
  hours: DayHours[];
  /** Deep link to the salon's booking system. Empty string = not yet provided. */
  bookingUrl: string;
}

export interface Market {
  slug: string;
  name: string;
  state: string;
  bookingSystem: BookingSystem;
  /** One-line intro shown on the market page. */
  tagline: string;
  /** When true, the market is announced but salon details are not live yet. */
  comingSoon?: boolean;
  /** Square gift-card order link for this market. */
  giftCardUrl?: string;
  /**
   * Membership is tied to its city. Gold/Diamond are Square purchase links;
   * VIP is invitation-only (contact, no link). Empty/undefined = not published.
   */
  membership?: { gold?: string; diamond?: string };
  /** This market's own Instagram profile URL. */
  instagram?: string;
  salons: Salon[];
}

// Uniform hours across all salons today: Mon–Sat 9–9, Sun 9–7.
export const STANDARD_HOURS: DayHours[] = [
  { day: "Monday", open: "9:00 AM", close: "9:00 PM" },
  { day: "Tuesday", open: "9:00 AM", close: "9:00 PM" },
  { day: "Wednesday", open: "9:00 AM", close: "9:00 PM" },
  { day: "Thursday", open: "9:00 AM", close: "9:00 PM" },
  { day: "Friday", open: "9:00 AM", close: "9:00 PM" },
  { day: "Saturday", open: "9:00 AM", close: "9:00 PM" },
  { day: "Sunday", open: "9:00 AM", close: "7:00 PM" },
];

// Santa Monica keeps later Sunday hours (closes 8 PM instead of 7 PM).
export const SANTA_MONICA_HOURS: DayHours[] = [
  ...STANDARD_HOURS.slice(0, 6),
  { day: "Sunday", open: "9:00 AM", close: "8:00 PM" },
];

export const MARKETS: Market[] = [
  {
    slug: "chicago",
    name: "Chicago",
    state: "Illinois",
    bookingSystem: "square",
    tagline: "Five studios across the city, from the West Loop to River North.",
    instagram: "https://www.instagram.com/loveyou_nailsalon/",
    giftCardUrl: "https://app.squareup.com/gift/MLV2JAY2QBKBB/order",
    membership: {
      gold: "https://square.link/u/SXAVkqH4",
      diamond: "https://square.link/u/f9v1Av8O",
    },
    salons: [
      {
        slug: "west-loop",
        name: "West Loop",
        address: "118 N Halsted St",
        city: "Chicago",
        state: "IL",
        zip: "60661",
        phones: ["+1 (773) 707-1747"],
        hours: STANDARD_HOURS,
        bookingUrl:
          "https://book.squareup.com/appointments/kbamfopputrxms/location/LZDZBECNK192R/services",
      },
      {
        slug: "lake-view",
        name: "Lake View",
        address: "2829 N Clark St",
        city: "Chicago",
        state: "IL",
        zip: "60657",
        phones: ["+1 (773) 707-7031"],
        hours: STANDARD_HOURS,
        bookingUrl:
          "https://book.squareup.com/appointments/kbamfopputrxms/location/L9B6FFKFB3FKE/services",
      },
      {
        slug: "wicker-park",
        name: "Wicker Park",
        address: "1843 W North Ave",
        city: "Chicago",
        state: "IL",
        zip: "60622",
        phones: ["+1 (773) 707-7174"],
        hours: STANDARD_HOURS,
        bookingUrl:
          "https://book.squareup.com/appointments/kbamfopputrxms/location/LYD9R7TF34JF3/services",
      },
      {
        slug: "river-north",
        name: "River North",
        address: "353 W Chicago Ave",
        city: "Chicago",
        state: "IL",
        zip: "60654",
        phones: ["+1 (312) 764-9974"],
        hours: STANDARD_HOURS,
        bookingUrl:
          "https://book.squareup.com/appointments/kbamfopputrxms/location/LDBCA9SJV11ZW/services",
      },
      {
        slug: "downtown",
        name: "Downtown",
        address: "180 N Jefferson St",
        city: "Chicago",
        state: "IL",
        zip: "60661",
        phones: ["+1 (917) 881-0212"],
        hours: STANDARD_HOURS,
        bookingUrl:
          "https://book.squareup.com/appointments/kbamfopputrxms/location/LYVY53FF244JH/services",
      },
    ],
  },
  {
    slug: "santa-monica",
    name: "Santa Monica",
    state: "California",
    bookingSystem: "fresha",
    tagline: "Our California home, steps from 3rd Street Promenade.",
    instagram: "https://www.instagram.com/loveyou_santamonica/",
    // Santa Monica sells memberships & gift cards through Fresha (not Square).
    giftCardUrl: "https://www.fresha.com/en/buy-fresha-gift-card",
    membership: {
      gold: "https://www.fresha.com/en/a/love-you-nail-salon-santa-monica-1422-2nd-street-l6llnycz/paid-plans/details?menu=true&pId=3026442&routeCtx=en&selected=3285910&share=true&skipFirstStep=true",
      diamond: "https://www.fresha.com/en/a/love-you-nail-salon-santa-monica-1422-2nd-street-l6llnycz/paid-plans/details?menu=true&pId=3026442&routeCtx=en&selected=3285911&share=true&skipFirstStep=true",
    },
    salons: [
      {
        slug: "2nd-street",
        name: "Santa Monica",
        address: "1422 2nd Street",
        city: "Santa Monica",
        state: "CA",
        zip: "90401",
        phones: ["+1 424-508-5044"],
        hours: SANTA_MONICA_HOURS,
        bookingUrl:
          "https://www.fresha.com/a/love-you-nail-salon-santa-monica-1422-2nd-street-l6llnycz",
      },
    ],
  },
  {
    slug: "new-york",
    name: "Manhattan",
    state: "New York",
    bookingSystem: "square",
    tagline: "Our Manhattan studio in the heart of the Garment District.",
    instagram: "https://www.instagram.com/loveyou_new_york/",
    // NOTE: NY gift-card link is the best of two conflicting ones on the old site — verify.
    giftCardUrl: "https://app.squareup.com/gift/MLQ7DM9VW6BZ0/order",
    membership: {
      gold: "https://square.link/u/VACEQ93Z",
      diamond: "https://square.link/u/82Qp1F4w",
    },
    salons: [
      {
        slug: "manhattan",
        name: "Manhattan",
        address: "148 W 37th St",
        city: "New York",
        state: "NY",
        zip: "10018",
        phones: ["+1 917-969-9767"],
        hours: STANDARD_HOURS,
        bookingUrl:
          "https://book.squareup.com/appointments/cyq3jbr9fllsnc/location/L9RFEDH639J50/services",
      },
    ],
  },
];

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}

/** Google Maps directions link built from a salon's address (no API key needed). */
export function mapsUrl(salon: Salon): string {
  const q = encodeURIComponent(
    `Love You Nail Salon, ${salon.address}, ${salon.city}, ${salon.state} ${salon.zip}`,
  );
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** Where the "Book" button goes: the booking deep link, or a call fallback. */
export function bookingHref(salon: Salon): string {
  if (salon.bookingUrl) return salon.bookingUrl;
  const tel = salon.phones[0]?.replace(/[^\d+]/g, "");
  return tel ? `tel:${tel}` : "#";
}
