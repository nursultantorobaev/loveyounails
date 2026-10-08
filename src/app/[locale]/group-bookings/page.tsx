import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MARKETS, type Salon } from "@/lib/locations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Groups" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function GroupBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GroupsContent />;
}

// The studio running the limited-time 10% group offer (4+ guests).
const OFFER_SALON = "west-loop";

type Point = { title: string; body: string };

function GroupsContent() {
  const t = useTranslations("Groups");
  const points = t.raw("points") as Point[];
  const occasions = t.raw("occasions") as string[];
  const markets = MARKETS.filter((m) => !m.comingSoon && m.salons.length);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-4 text-5xl uppercase leading-tight text-espresso md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-brown leading-relaxed">{t("intro")}</p>
      </header>

      {/* What's included */}
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {points.map((p) => (
          <div key={p.title} className="rounded-3xl border border-sand bg-cream p-7">
            <span className="text-gold-dark">◆</span>
            <h2 className="mt-3 text-lg font-medium text-espresso">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-brown">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Limited-time offer */}
      <section className="mt-10 rounded-3xl bg-espresso px-6 py-12 text-cream md:px-14">
        <p className="eyebrow !text-gold">{t("offerEyebrow")}</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">{t("offerTitle")}</h2>
        <p className="mt-4 max-w-2xl text-cream/75 leading-relaxed">{t("offerBody")}</p>
      </section>

      {/* Occasions */}
      <section className="mt-14">
        <p className="eyebrow">{t("perfectFor")}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {occasions.map((o) => (
            <li
              key={o}
              className="rounded-full border border-sand px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-espresso"
            >
              {o}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact: call the studio */}
      <section id="contact" className="mt-20 scroll-mt-24">
        <h2 className="text-3xl text-espresso md:text-4xl">{t("contactTitle")}</h2>
        <p className="mt-4 max-w-2xl text-brown leading-relaxed">{t("contactBody")}</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {markets.map((m) => (
            <div key={m.slug}>
              <h3 className="font-display text-2xl text-espresso">{m.name}</h3>
              <ul className="mt-4 space-y-3">
                {m.salons.map((s) => (
                  <StudioCall
                    key={s.slug}
                    salon={s}
                    callLabel={t("call")}
                    badge={s.slug === OFFER_SALON ? t("offerBadge") : undefined}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StudioCall({ salon, callLabel, badge }: { salon: Salon; callLabel: string; badge?: string }) {
  const phone = salon.phones[0];
  if (!phone) return null;
  return (
    <li>
      <a
        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
        className="flex items-center justify-between gap-3 rounded-2xl border border-sand px-4 py-3 transition-colors hover:border-gold-dark"
      >
        <span>
          <span className="flex items-center gap-2 text-espresso">
            {salon.name}
            {badge && (
              <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.12em] text-gold-dark">
                {badge}
              </span>
            )}
          </span>
          <span className="block text-xs text-brown-soft">{salon.address}</span>
        </span>
        <span className="shrink-0 text-right text-sm text-espresso">
          <span className="block text-[0.62rem] uppercase tracking-[0.16em] text-gold-dark">{callLabel}</span>
          {phone}
        </span>
      </a>
    </li>
  );
}
