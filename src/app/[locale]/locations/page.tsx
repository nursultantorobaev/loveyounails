import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CityPhoto from "@/components/CityPhoto";
import { MARKETS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Locations | Love You Nail Salon",
  description:
    "Find a Love You Nail Salon near you. Studios in Chicago, Santa Monica, and coming soon to New York. Choose your location and book online.",
};

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LocationsContent />;
}

function LocationsContent() {
  const t = useTranslations("LocationsPage");
  const tm = useTranslations("Markets");
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <header className="max-w-2xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-4 text-5xl uppercase leading-tight text-espresso md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-brown leading-relaxed">{t("intro")}</p>
      </header>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {MARKETS.map((m) => {
          const count = m.salons.length;
          const inner = (
            <>
              <CityPhoto
                city={m.slug}
                className="aspect-4/3 w-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="flex flex-1 flex-col p-7">
                <h2 className="text-3xl text-espresso">{m.name}</h2>
                <p className="mt-1 text-sm text-brown-soft">
                  {tm(`states.${m.slug}`)}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-brown">
                  {tm(`taglines.${m.slug}`)}
                </p>
                <span className="mt-6 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-gold-dark">
                  {m.comingSoon
                    ? t("openingSoon")
                    : `${t("viewStudios", { count })} →`}
                </span>
              </div>
            </>
          );

          const cardClass =
            "flex flex-col overflow-hidden rounded-3xl border border-sand bg-cream";

          return m.comingSoon ? (
            <div key={m.slug} className={`${cardClass} opacity-70`}>
              {inner}
            </div>
          ) : (
            <Link
              key={m.slug}
              href={`/locations/${m.slug}`}
              className={`${cardClass} group transition-shadow hover:shadow-lg hover:shadow-espresso/5`}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
