import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SalonCard from "@/components/SalonCard";
import CityPhoto from "@/components/CityPhoto";
import MembershipJoin, { type JoinOption } from "@/components/MembershipJoin";
import InstagramFeed from "@/components/InstagramFeed";
import { MARKETS, getMarket } from "@/lib/locations";

type MarketParams = { params: Promise<{ locale: string; market: string }> };

export function generateStaticParams() {
  return MARKETS.map((m) => ({ market: m.slug }));
}

export async function generateMetadata({
  params,
}: MarketParams): Promise<Metadata> {
  const { market } = await params;
  const m = getMarket(market);
  if (!m) return { title: "Locations | Love You Nail Salon" };
  return {
    title: `${m.name} | Love You Nail Salon`,
    description: `Love You Nail Salon in ${m.name}, ${m.state}. ${m.tagline} View addresses, hours and book online.`,
  };
}

const bookingLabel: Record<string, string> = {
  square: "Square Appointments",
  fresha: "Fresha",
};

export default async function MarketPage({ params }: MarketParams) {
  const { locale, market } = await params;
  setRequestLocale(locale);
  const m = getMarket(market);
  if (!m) notFound();

  const t = await getTranslations("MarketPage");
  const tm = await getTranslations("Markets");

  return (
    <>
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      {/* Breadcrumb */}
      <Link
        href="/locations"
        className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brown-soft transition-colors hover:text-gold-dark"
      >
        ← {t("allLocations")}
      </Link>

      {/* City banner */}
      <div className="relative mt-6 overflow-hidden rounded-3xl">
        <CityPhoto
          city={m.slug}
          sizes="100vw"
          className="h-52 w-full md:h-72"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-espresso/45 to-transparent p-6 md:p-9">
          <div>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-cream/85">
              {tm(`states.${m.slug}`)}
            </p>
            <h1 className="mt-2 font-display text-4xl uppercase leading-tight text-cream md:text-6xl">
              {m.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Intro */}
      <header className="mt-8 max-w-2xl">
        <p className="text-brown leading-relaxed">{tm(`taglines.${m.slug}`)}</p>
        {!m.comingSoon && (
          <p className="mt-4 text-sm text-brown-soft">
            <span className="text-espresso">
              {t("bookingThrough", { system: bookingLabel[m.bookingSystem] })}
            </span>
          </p>
        )}
        {m.email && (
          <a
            href={`mailto:${m.email}`}
            className="mt-2 inline-block text-sm text-gold-dark transition-colors hover:text-espresso"
          >
            {m.email}
          </a>
        )}
        {!m.comingSoon && (
          <div className="mt-8 space-y-5">
            {(m.membership?.gold || m.membership?.diamond) && (
              <MembershipJoin
                heading={t("memberships")}
                options={
                  [
                    m.membership?.gold && {
                      key: "gold",
                      label: "Gold",
                      cityName: m.name,
                      tierName: "Gold",
                      url: m.membership.gold,
                    },
                    m.membership?.diamond && {
                      key: "diamond",
                      label: "Diamond",
                      cityName: m.name,
                      tierName: "Diamond",
                      url: m.membership.diamond,
                    },
                  ].filter(Boolean) as JoinOption[]
                }
              />
            )}
            <div className="flex flex-wrap gap-3">
              {m.giftCardUrl && (
                <a
                  href={m.giftCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-espresso px-5 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-gold-dark"
                >
                  {t("giftCard")}
                </a>
              )}
              {m.instagram && (
                <a
                  href={m.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-espresso/25 px-5 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  @{m.instagram.replace(/\/+$/, "").split("/").pop()}
                </a>
              )}
              {m.tiktok && (
                <a
                  href={m.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-espresso/25 px-5 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.9v2.5c-1.3.1-2.5-.3-3.5-1v5.9c0 3.3-2.4 5.7-5.5 5.7A5.4 5.4 0 0 1 5.5 14c0-3 2.3-5.4 5.5-5.4.3 0 .6 0 .9.1v2.6a2.9 2.9 0 0 0-1-.2 2.8 2.8 0 0 0 0 5.6c1.6 0 2.7-1.2 2.7-2.9V3h2.9z" />
                  </svg>
                  TikTok
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Salons */}
      {m.comingSoon || m.salons.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-dashed border-sand bg-ivory p-12 text-center">
          <h2 className="text-3xl text-espresso">{t("openingSoon")}</h2>
          <p className="mx-auto mt-4 max-w-md text-brown leading-relaxed">
            {t("openingSoonBody", { city: m.name })}
          </p>
          <Link
            href="/locations"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-espresso px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark"
          >
            {t("viewOther")}
          </Link>
        </div>
      ) : (
        <div className="mt-14 space-y-6">
          {m.salons.map((s) => (
            <SalonCard key={s.slug} salon={s} />
          ))}
        </div>
      )}
    </div>
    {!m.comingSoon && (
      <InstagramFeed feedId={m.beholdFeedId} profileUrl={m.instagram} />
    )}
    </>
  );
}
