// Site search: a small in-browser index built from the same translation messages
// the pages render, so results always match what's on the site in the visitor's
// language. No server, no external service.
//
// Each entry has a title, a short snippet, where it goes (a link or an action),
// and multilingual keywords so common words find the right page in any language
// (e.g. "парковка" or "parking" → the Chicago parking FAQ).

import { MARKETS } from "./locations";
import { MEMBERSHIP_TIERS } from "./content";
import { PRODUCTS } from "./products";
import { PROMO } from "./promo";

export type SearchGroup =
  | "pages"
  | "locations"
  | "services"
  | "faq"
  | "shop"
  | "policies";

export interface SearchEntry {
  id: string;
  group: SearchGroup;
  title: string;
  snippet: string;
  /** Locale-less path, e.g. "/locations/chicago#faq-5". */
  href?: string;
  /** Instead of a link: open the promo popup. */
  action?: "promo";
  // Normalized text used for matching.
  t: string;
  k: string;
  b: string;
}

export interface SearchResult extends SearchEntry {
  score: number;
}

type Msgs = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Lowercase, strip accents, ё→е — so "unas"/"uñas", "ещё"/"еще" match. */
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ё/g, "е");
}

// Synonyms in EN / RU / ES, so a word in any language finds the right page.
const KW = {
  giftCards: "gift card cards certificate voucher present подарок подарочная сертификат сертификаты regalo tarjeta",
  sterilization: "sterility sterilization sterile autoclave hygiene clean safety tools steam стерильность стерилизация стерильно автоклав гигиена чистота инструменты безопасность esterilidad esterilizacion higiene limpieza autoclave",
  groups: "group groups party parties bridal bride bachelorette birthday corporate event girls friends deposit celebration группа компания праздник девичник свадьба день рождения корпоратив депозит grupo fiesta despedida novia cumpleanos evento corporativo deposito",
  memberships: "membership member members discount gold diamond vip subscription yearly абонемент абонементы членство скидка подписка membresia descuento",
  locations: "location locations address studio studios salon salons near map directions hours open адрес локации студия студии салон часы работы ubicacion direccion estudio horario",
  shop: "shop store products buy polish gel oil file cuticle магазин товары купить лак масло пилка tienda productos comprar esmalte aceite lima",
  salonPolicy: "policy policies rules cancellation cancel late lateness refund deposit no-show reschedule правила отмена опоздание возврат депозит перенос politica cancelacion retraso reembolso",
  privacy: "privacy data personal information cookies конфиденциальность данные privacidad datos",
  terms: "membership terms conditions agreement условия абонемента terminos condiciones",
  promo: "discount promo promotion offer sale deal first visit new client clients 20% скидка акция предложение первый визит новым клиентам descuento oferta promocion primera visita nuevos clientes",
  services: "service services manicure pedicure nails nail gel russian e-file услуги маникюр педикюр ногти гель аппаратный servicios manicura pedicura unas",
  about: "about story founded brand who we are о нас история бренд sobre nosotros historia",
  reviews: "reviews testimonials rating feedback отзывы оценки resenas opiniones",
  portfolio: "portfolio gallery photos work designs nail art портфолио галерея фото работы дизайн portafolio galeria fotos disenos",
  advantages: "advantages why us difference accuracy palette technique details преимущества почему мы ventajas",
  credits: "credits image photo license авторы изображения creditos",
} as const;

// FAQ topics: extra words in all three languages, matched on the question text.
const FAQ_TOPICS: [RegExp, string][] = [
  [/park|парк|estacion/i, "parking park car street garage парковка машина estacionamiento"],
  [/child|kid|дет|niñ|nin/i, "kids children child baby дети ребенок niños"],
  [/cancel|отмен|cancela/i, "cancel cancellation reschedule отмена перенос cancelar"],
  [/walk|без записи|sin cita/i, "walk-in walk in no appointment без записи sin cita"],
  [/chip|lift|скол|отойд|desprend|astill/i, "chip chipped broken lifted fix repair warranty скол сломался починить ремонт гарантия arreglar reparar"],
  [/gift|подар|сертиф|regalo/i, "gift card certificate подарок сертификат regalo tarjeta"],
  [/lash|brow|ресниц|бров|pestañ|ceja/i, "lashes lash brows brow extensions lamination ресницы брови ламинирование pestañas cejas"],
  [/extension|наращ|extensi/i, "extensions length tips acrylic gel x наращивание длина extensiones acrilico"],
  [/location|studio|студи|ubicac|estudio/i, "locations studios address где адрес ubicaciones direccion"],
  [/russian|русск|rusa/i, "russian e-file dry manicure русский аппаратный маникюр manicura rusa"],
];

function entry(e: Omit<SearchEntry, "t" | "k" | "b"> & { keywords?: string; body?: string }): SearchEntry {
  const { keywords = "", body = "", ...rest } = e;
  return { ...rest, t: normalize(e.title), k: normalize(keywords), b: normalize(`${e.snippet} ${body}`) };
}

const clip = (s: string, n = 140) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Build the index for one locale from its messages (the object passed to NextIntlClientProvider). */
export function buildSearchIndex(m: Msgs): SearchEntry[] {
  const out: SearchEntry[] = [];
  const nav = m.Nav ?? {};

  // --- Pages --------------------------------------------------------------
  out.push(
    entry({ id: "about", group: "pages", title: str(m.About?.title), snippet: clip(str(m.About?.p1)), href: "/#about", keywords: `${nav.about} ${KW.about}`, body: `${str(m.About?.p2)} ${str(m.About?.inclusive)}` }),
    entry({ id: "services", group: "pages", title: str(m.Services?.title), snippet: clip(str(m.Services?.intro)), href: "/#services", keywords: `${nav.services} ${KW.services}`, body: `${str(m.Services?.manicureBody)} ${str(m.Services?.pedicureBody)}` }),
    entry({ id: "advantages", group: "pages", title: str(m.BestSalon?.title), snippet: Object.values(m.BestSalon?.words ?? {}).join(" · "), href: "/#advantages", keywords: `${nav.advantages} ${KW.advantages}` }),
    entry({ id: "portfolio", group: "pages", title: str(m.Portfolio?.title), snippet: clip(str(m.Portfolio?.intro)), href: "/#portfolio", keywords: KW.portfolio }),
    entry({ id: "reviews", group: "pages", title: str(m.Reviews?.title), snippet: str(m.Reviews?.eyebrow), href: "/#reviews", keywords: `${nav.reviews} ${KW.reviews}` }),
    entry({ id: "locations", group: "pages", title: str(m.LocationsPage?.title), snippet: clip(str(m.LocationsPage?.intro)), href: "/locations", keywords: `${nav.locations} ${KW.locations}` }),
    entry({ id: "memberships", group: "pages", title: str(m.Memberships?.title), snippet: clip(str(m.Memberships?.intro)), href: "/memberships", keywords: `${nav.memberships} ${KW.memberships}`, body: `${str(m.Memberships?.step2Body)} ${str(m.Memberships?.tiedBody)}` }),
    entry({ id: "gift-cards", group: "pages", title: str(m.GiftCards?.title), snippet: clip(str(m.GiftCards?.intro)), href: "/gift-cards", keywords: `${nav.giftCards} ${KW.giftCards}`, body: str(m.GiftCards?.note) }),
    entry({ id: "sterilization", group: "pages", title: str(m.Sterilization?.title), snippet: clip(str(m.Sterilization?.intro1)), href: "/sterilization", keywords: KW.sterilization, body: `${str(m.Sterilization?.intro2)} ${str(m.Sterilization?.freshBody)}` }),
    entry({ id: "groups", group: "pages", title: str(m.Groups?.title), snippet: clip(str(m.Groups?.intro)), href: "/group-bookings", keywords: `${str(m.Groups?.eyebrow)} ${KW.groups}`, body: `${str(m.Groups?.offerTitle)} ${str(m.Groups?.offerBody)} ${(m.Groups?.occasions ?? []).join(" ")}` }),
    entry({ id: "shop", group: "pages", title: str(m.Shop?.title), snippet: clip(str(m.Shop?.intro)), href: "/shop", keywords: `${nav.shop} ${KW.shop}` }),
    entry({ id: "salon-policy", group: "policies", title: str(m.Salon?.title), snippet: clip(str(m.Salon?.intro)), href: "/salon-policy", keywords: KW.salonPolicy }),
    entry({ id: "privacy", group: "policies", title: str(m.Privacy?.title), snippet: clip(str(m.Privacy?.intro)), href: "/privacy-policy", keywords: KW.privacy }),
    entry({ id: "terms", group: "policies", title: str(m.Terms?.title), snippet: clip(str(m.Terms?.intro)), href: "/memberships/terms", keywords: KW.terms }),
    entry({ id: "credits", group: "policies", title: str(m.Credits?.title), snippet: clip(str(m.Credits?.intro)), href: "/credits", keywords: KW.credits }),
  );

  // The current promo opens its popup rather than a page.
  if (PROMO.enabled && m.Promo) {
    out.push(entry({ id: "promo", group: "pages", title: `${str(m.Promo.headline)} ${str(m.Promo.subhead)}`, snippet: clip(str(m.Promo.bar)), action: "promo", keywords: KW.promo, body: str(m.Promo.body) }));
  }

  // --- Locations: each city + each studio ----------------------------------
  for (const market of MARKETS) {
    if (market.comingSoon) continue;
    const state = str(m.Markets?.states?.[market.slug]);
    out.push(entry({
      id: `market-${market.slug}`, group: "locations",
      title: `${market.name}${state && state !== market.name ? `, ${state}` : ""}`,
      snippet: clip(str(m.Markets?.taglines?.[market.slug])),
      href: `/locations/${market.slug}`,
      keywords: `${market.slug.replace("-", " ")} ${KW.locations}`,
    }));
    if (market.salons.length > 1 || market.salons[0]?.name !== market.name) {
      for (const s of market.salons) {
        out.push(entry({
          id: `salon-${s.slug}`, group: "locations",
          title: `${s.name} — ${s.city}`,
          snippet: `${s.address}, ${s.city}, ${s.state} ${s.zip} · ${s.phones[0] ?? ""}`,
          href: `/locations/${market.slug}#${s.slug}`,
          keywords: `${market.name} ${s.address} ${s.zip} ${s.phones.join(" ").replace(/\D/g, " ")} studio salon студия estudio`,
        }));
      }
    }
  }

  // --- Services --------------------------------------------------------------
  const services = (m.Services?.list ?? []) as { name: string; description: string }[];
  services.forEach((s, i) => {
    out.push(entry({ id: `service-${i}`, group: "services", title: s.name, snippet: clip(s.description), href: "/#services", keywords: KW.services }));
  });
  for (const tier of MEMBERSHIP_TIERS) {
    const tm = m.Memberships?.tiers?.[tier.key];
    if (!tm) continue;
    out.push(entry({ id: `tier-${tier.key}`, group: "services", title: `${tier.name} — ${str(m.Nav?.memberships)}`, snippet: clip(`${str(tm.tagline)} ${str(tm.perk0)}`), href: "/memberships", keywords: KW.memberships, body: str(tm.perk1) }));
  }

  // --- FAQ (per city) -------------------------------------------------------
  const faqs = (m.Faq?.markets ?? {}) as Record<string, { q: string; a: string }[]>;
  for (const [slug, items] of Object.entries(faqs)) {
    const market = MARKETS.find((x) => x.slug === slug);
    if (!market) continue;
    items.forEach((it, i) => {
      const topics = FAQ_TOPICS.filter(([re]) => re.test(it.q)).map(([, kw]) => kw).join(" ");
      out.push(entry({ id: `faq-${slug}-${i}`, group: "faq", title: it.q, snippet: `${market.name} · ${clip(it.a, 110)}`, href: `/locations/${slug}#faq-${i}`, keywords: `${market.name} ${topics}`, body: it.a }));
    });
  }

  // --- Shop -------------------------------------------------------------------
  for (const p of PRODUCTS) {
    const pm = m.Shop?.products?.[p.slug];
    if (!pm) continue;
    out.push(entry({ id: `product-${p.slug}`, group: "shop", title: [pm.name, pm.variant].filter(Boolean).join(" — "), snippet: clip(str(pm.description)), href: `/shop#${p.slug}`, keywords: `${str(m.Shop?.categories?.[p.category])} ${KW.shop}` }));
  }

  // --- Sterilization steps, group points, policy sections ---------------------
  ((m.Sterilization?.steps ?? []) as { title: string; body: string }[]).forEach((s, i) => {
    out.push(entry({ id: `steril-${i}`, group: "pages", title: `${str(m.Sterilization?.eyebrow)}: ${s.title}`, snippet: clip(s.body), href: "/sterilization", keywords: KW.sterilization }));
  });
  ((m.Groups?.points ?? []) as { title: string; body: string }[]).forEach((p, i) => {
    out.push(entry({ id: `group-${i}`, group: "pages", title: p.title, snippet: clip(p.body), href: "/group-bookings", keywords: KW.groups }));
  });
  for (const [ns, href, kw] of [["Salon", "/salon-policy", KW.salonPolicy], ["Privacy", "/privacy-policy", KW.privacy]] as const) {
    ((m[ns]?.sections ?? []) as { title: string; paragraphs: string[] }[]).forEach((s, i) => {
      out.push(entry({ id: `${ns}-${i}`, group: "policies", title: s.title, snippet: clip(s.paragraphs.join(" ")), href: `${href}#section-${i}`, keywords: kw, body: s.paragraphs.join(" ") }));
    });
  }

  return out.filter((e) => e.title.trim());
}

const GROUP_WEIGHT: Record<SearchGroup, number> = {
  pages: 1.2, locations: 1.2, faq: 1, services: 1, shop: 1, policies: 0.8,
};

const wordStart = (hay: string, tok: string) => hay.startsWith(tok) || hay.includes(` ${tok}`) || hay.includes(`-${tok}`);

/** Crude stem so "chipped"/"chips", "booking"/"book", "маникюра"/"маникюр" meet. */
function stem(tok: string): string {
  if (tok.length < 5) return tok;
  const m = tok.match(/^(.{3,}?)(ings?|ed|es|s|ly|ами|ями|ого|ему|ой|ей|ам|ах|ы|и|а|я|у|ю|е|ом|ов)$/);
  return m ? m[1].replace(/(.)\1$/, "$1") : tok; // "chipp" → "chip"
}

function tokenScore(e: SearchEntry, tok: string): number {
  const sub = tok.length >= 3; // substring matches only for 3+ letters (Russian word endings)
  if (wordStart(e.t, tok)) return 8;
  if (sub && e.t.includes(tok)) return 5;
  if (wordStart(e.k, tok)) return 4;
  if (sub && e.k.includes(tok)) return 3;
  if (wordStart(e.b, tok)) return 2;
  if (sub && e.b.includes(tok)) return 1;
  return 0;
}

/** Title matches rank highest. Every query word must match; if nothing matches
 *  all of them, fall back to entries matching most of the words. */
export function searchIndex(index: SearchEntry[], query: string, limit = 12): SearchResult[] {
  const tokens = normalize(query).split(/[\s,.;:!?/()]+/).filter(Boolean);
  if (!tokens.length) return [];
  const scored = index.map((e) => {
    let score = 0;
    let matched = 0;
    for (const tok of tokens) {
      // The exact word beats its stem: "parking" should find the parking FAQ
      // before "Wicker Park".
      const exact = tokenScore(e, tok);
      const st = stem(tok);
      const s = exact ? exact + 3 : st !== tok ? tokenScore(e, st) * 0.6 : 0;
      if (s) { matched++; score += s; }
    }
    return { e, score: score * GROUP_WEIGHT[e.group], matched };
  });
  let hits = scored.filter((x) => x.matched === tokens.length);
  if (!hits.length && tokens.length > 1) {
    const need = Math.ceil(tokens.length / 2);
    hits = scored.filter((x) => x.matched >= need).map((x) => ({ ...x, score: x.score * 0.6 }));
  }
  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ e, score }) => ({ ...e, score }));
}
