import type { Metadata } from "next";
import { localizedMeta } from "@/lib/seo";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { MARKETS } from "@/lib/locations";
import CityPhoto from "@/components/CityPhoto";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedMeta(locale, "giftCards", "/gift-cards");
}

export default async function GiftCardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GiftCardsContent />;
}

// Gift cards are sold per city (each city is its own Square account), so the page
// is one card per market that has a gift-card link.
function GiftCardsContent() {
  const t = useTranslations("GiftCards");
  const tm = useTranslations("Markets");
  const markets = MARKETS.filter((m) => m.giftCardUrl && !m.comingSoon);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <header className="max-w-2xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-4 text-5xl uppercase leading-tight text-espresso md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-brown leading-relaxed">{t("intro")}</p>
      </header>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {markets.map((m) => (
          <div
            key={m.slug}
            className="flex flex-col overflow-hidden rounded-3xl border border-sand bg-cream"
          >
            <CityPhoto city={m.slug} className="aspect-4/3 w-full" />
            <div className="flex flex-1 flex-col p-6">
              <p className="eyebrow">{tm(`states.${m.slug}`)}</p>
              <h2 className="mt-2 font-display text-3xl text-espresso">{m.name}</h2>
              <p className="mt-2 text-sm text-brown">{t(`cityNote.${m.slug}`)}</p>
              <a
                href={m.giftCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-espresso px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-gold-dark"
              >
                {t("buy", { city: m.name })}
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-brown-soft">{t("note")}</p>
    </div>
  );
}
