import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import CityPhoto from "@/components/CityPhoto";
import JsonLd from "@/components/JsonLd";
import { groupHours } from "@/components/SalonCard";
import { bookingHref, mapsUrl } from "@/lib/locations";
import { allStudioPages, getStudio, POPULAR_SERVICES } from "@/lib/studios";
import { breadcrumbLd, languageAlternates, pageUrl, salonLd, SITE_NAME } from "@/lib/seo";

type StudioParams = { params: Promise<{ locale: string; market: string; studio: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allStudioPages().map(({ market, salon }) => ({ locale, market: market.slug, studio: salon.slug })),
  );
}

export async function generateMetadata({ params }: StudioParams): Promise<Metadata> {
  const { locale, market, studio } = await params;
  const found = getStudio(market, studio);
  if (!found) return {};
  const t = await getTranslations({ locale, namespace: "Studio" });
  const path = `/locations/${market}/${studio}`;
  const title = t(`studios.${studio}.seoTitle`);
  const description = t(`studios.${studio}.seoDescription`);
  return {
    title,
    description,
    alternates: { canonical: pageUrl(locale, path), languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      url: pageUrl(locale, path),
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: "/media/photos/nails-nude-macro.png", width: 1948, height: 1596, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/media/photos/nails-nude-macro.png"] },
  };
}

export default async function StudioPage({ params }: StudioParams) {
  const { locale, market: marketSlug, studio } = await params;
  setRequestLocale(locale);
  const found = getStudio(marketSlug, studio);
  if (!found) notFound();
  const { market, salon } = found;

  const t = await getTranslations("Studio");
  const tc = await getTranslations("SalonCard");
  const tp = await getTranslations("Prices");
  const tn = await getTranslations("Nav");

  const name = salon.name;
  const phone = salon.phones[0];
  const book = bookingHref(salon);
  const hoursText = groupHours(salon.hours)
    .map((r) => `${r.endKey ? `${tc(`days.${r.startKey}`)} – ${tc(`days.${r.endKey}`)}` : tc(`days.${r.startKey}`)}: ${r.time}`)
    .join("; ");
  const parking = salon.parkingZone ? t("parkingBody", { zone: salon.parkingZone }) : null;
  const transit = t(`studios.${salon.slug}.transit`);
  const services = POPULAR_SERVICES[market.slug] ?? [];
  const others = market.salons.filter((s) => s.slug !== salon.slug);
  // Address only: with the brand name Google may pin a different Love You studio nearby.
  const mapQuery = encodeURIComponent(`${salon.address}, ${salon.city}, ${salon.state} ${salon.zip}`);

  const faq = [
    ...(parking ? [{ q: t("faq.parkingQ", { name }), a: parking }] : []),
    { q: t("faq.transitQ", { name }), a: transit },
    { q: t("faq.hoursQ", { name }), a: `${hoursText}.` },
    { q: t("faq.bookQ", { name }), a: t("faq.bookA", { name, phone }) },
    { q: t("faq.memberQ", { name }), a: t("faq.memberA") },
  ];

  const path = `/locations/${market.slug}/${salon.slug}`;

  return (
    <>
      <JsonLd
        data={[
          salonLd(market, salon, locale),
          breadcrumbLd([
            { name: SITE_NAME, url: pageUrl(locale) },
            { name: tn("locations"), url: pageUrl(locale, "/locations") },
            { name: market.name, url: pageUrl(locale, `/locations/${market.slug}`) },
            { name, url: pageUrl(locale, path) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brown-soft">
          <Link href="/locations" className="transition-colors hover:text-gold-dark">{tn("locations")}</Link>
          <span aria-hidden>/</span>
          <Link href={`/locations/${market.slug}`} className="transition-colors hover:text-gold-dark">{market.name}</Link>
          <span aria-hidden>/</span>
          <span className="text-espresso">{name}</span>
        </nav>

        {/* Banner */}
        <div className="relative mt-6 overflow-hidden rounded-3xl">
          <CityPhoto city={market.slug} sizes="100vw" className="h-52 w-full md:h-72" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-espresso/55 to-transparent p-6 md:p-9">
            <div>
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-cream/85">
                {salon.city}, {salon.state}
              </p>
              <h1 className="mt-2 font-display text-4xl uppercase leading-tight text-cream md:text-6xl">
                {t("h1", { name })}
              </h1>
            </div>
          </div>
        </div>

        {/* Intro + contact */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-lg leading-relaxed text-brown">{t(`studios.${salon.slug}.intro`)}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={book}
                target={book.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-espresso px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark"
              >
                {t("book", { name })}
              </a>
              <a
                href={mapsUrl(salon)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-espresso/25 px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
              >
                {tc("directions")}
              </a>
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center justify-center rounded-full border border-espresso/25 px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
                >
                  {t("call")}
                </a>
              )}
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <Label>{t("address")}</Label>
                <div className="mt-2 text-espresso">
                  {salon.address}
                  <br />
                  {salon.city}, {salon.state} {salon.zip}
                </div>
              </div>
              {phone && (
                <div>
                  <Label>{t("phone")}</Label>
                  <div className="mt-2">
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-espresso transition-colors hover:text-gold-dark">
                      {phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="sm:col-span-2">
                <Label>{tc("workingHours")}</Label>
                <div className="mt-2 max-w-sm space-y-1.5">
                  {groupHours(salon.hours).map((r) => (
                    <div key={r.startKey} className="flex justify-between gap-6 text-sm text-brown">
                      <span>{r.endKey ? `${tc(`days.${r.startKey}`)} – ${tc(`days.${r.endKey}`)}` : tc(`days.${r.startKey}`)}</span>
                      <span className="tabular-nums">{r.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-sand bg-ivory">
            <iframe
              title={t("mapTitle", { name })}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full lg:h-full lg:min-h-[420px]"
            />
          </div>
        </div>

        {/* Getting here */}
        <section className="mt-16">
          <h2 className="font-display text-3xl uppercase leading-tight text-espresso md:text-4xl">{t("gettingHere")}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {parking && (
              <div className="rounded-2xl border border-sand bg-cream p-6">
                <Label>{t("parkingTitle")}</Label>
                <p className="mt-3 leading-relaxed text-brown">{parking}</p>
              </div>
            )}
            <div className="rounded-2xl border border-sand bg-cream p-6">
              <Label>{t("transitTitle")}</Label>
              <p className="mt-3 leading-relaxed text-brown">{transit}</p>
            </div>
          </div>
        </section>

        {/* Popular services */}
        {services.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl uppercase leading-tight text-espresso md:text-4xl">{t("servicesTitle")}</h2>
            <ul className="mt-6 divide-y divide-sand border-y border-sand">
              {services.map((s) => (
                <li key={s.id} className="flex items-baseline justify-between gap-6 py-4">
                  <span className="text-espresso">{tp(`items.${s.id}.name`)}</span>
                  <span className="whitespace-nowrap text-brown tabular-nums">
                    {s.from ? `${t("from")} ` : ""}${s.price}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-brown-soft">{t("servicesNote")}</p>
            <a
              href={book}
              target={book.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-espresso px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark"
            >
              {t("book", { name })}
            </a>
          </section>
        )}

        {/* Why us */}
        <section className="mt-16 rounded-3xl bg-ivory p-8 md:p-12">
          <h2 className="font-display text-3xl uppercase leading-tight text-espresso md:text-4xl">{t("whyTitle", { name })}</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            <li className="leading-relaxed text-brown">{t("why.technique")}</li>
            <li className="leading-relaxed text-brown">
              {t("why.sterility")}{" "}
              <Link href="/sterilization" className="text-gold-dark underline-offset-4 hover:underline">{t("why.sterilityLink")} →</Link>
            </li>
            <li className="leading-relaxed text-brown">
              {t("why.membership")}{" "}
              <Link href="/memberships" className="text-gold-dark underline-offset-4 hover:underline">{t("why.membershipLink")} →</Link>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-16 border-t border-sand pt-12">
          <h2 className="font-display text-3xl uppercase leading-tight text-espresso md:text-4xl">{t("faqTitle", { name })}</h2>
          <div className="mt-8 border-t border-sand">
            {faq.map((f, i) => (
              <details key={i} className="group border-b border-sand">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-espresso transition-colors hover:text-gold-dark [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-brown-soft transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="pb-5 pr-8 leading-relaxed text-brown">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Other studios */}
        {others.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl uppercase leading-tight text-espresso md:text-4xl">
              {t("otherStudios", { city: market.name })}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  href={`/locations/${market.slug}/${s.slug}`}
                  className="group rounded-2xl border border-sand bg-cream p-6 transition-colors hover:border-gold-dark"
                >
                  <p className="font-display text-2xl text-espresso">{s.name}</p>
                  <p className="mt-2 text-sm text-brown">{s.address}</p>
                  <span className="mt-4 inline-block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-gold-dark">
                    {t("viewStudio")} →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold-dark">{children}</p>;
}
