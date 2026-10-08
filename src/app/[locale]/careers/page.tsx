import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MARKETS } from "@/lib/locations";
import { getOpenings, type Opening } from "@/lib/careers";
import CareersBoard from "@/components/CareersBoard";

// Openings come from the admins' Google Sheet; re-read it every 10 minutes.
export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Careers");

  // Sheet openings when the Careers tab is set up; otherwise the translated defaults.
  const fromSheet = await getOpenings();
  const openings: Opening[] = fromSheet ?? (t.raw("defaults") as Opening[]);
  const cities = MARKETS.filter((m) => !m.comingSoon).map((m) => m.salons[0]?.city ?? m.name);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-4 text-5xl uppercase leading-tight text-espresso md:text-6xl">{t("title")}</h1>
        <p className="mt-5 text-brown leading-relaxed">{t("intro")}</p>
      </header>
      <CareersBoard openings={openings} cities={cities} />
    </div>
  );
}
