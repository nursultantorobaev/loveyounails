import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Button from "@/components/ui/Button";
import { PRICE_LIST } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Services & Pricing | Love You Nail Salon",
  description:
    "Love You Nail Salon price list — Russian gel manicure, smart pedicure, combos, extensions and nail art. Book online at your nearest studio.",
};

export default async function PricesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PricesContent />;
}

function PricesContent() {
  const t = useTranslations("Prices");
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
      <header className="max-w-2xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-4 text-5xl leading-tight text-espresso md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-brown leading-relaxed">{t("intro")}</p>
      </header>

      <div className="mt-14 space-y-14">
        {PRICE_LIST.map((cat) => (
          <section key={cat.key}>
            <div className="flex items-baseline gap-4">
              <h2 className="text-3xl text-espresso">
                {t(`categories.${cat.key}`)}
              </h2>
              <span className="h-px flex-1 bg-sand" />
            </div>
            <ul className="mt-6 divide-y divide-sand/70">
              {cat.items.map((item) => {
                const note = t(`items.${item.id}.note`);
                return (
                  <li
                    key={item.id}
                    className="flex items-baseline justify-between gap-6 py-4"
                  >
                    <div>
                      <span className="text-lg text-espresso">
                        {t(`items.${item.id}.name`)}
                      </span>
                      {note && (
                        <span className="mt-0.5 block text-xs uppercase tracking-[0.12em] text-brown-soft">
                          {note}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 font-display text-2xl text-gold-dark tabular-nums">
                      {item.from && (
                        <span className="mr-1 align-middle text-xs uppercase tracking-[0.14em] text-brown-soft">
                          {t("from")}
                        </span>
                      )}
                      ${item.price}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Note + CTA */}
      <div className="mt-16 rounded-3xl bg-ivory p-8 text-center md:p-12">
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-brown">
          {t("note")}
        </p>
        <div className="mt-7">
          <Button href="/locations">{t("bookCta")}</Button>
        </div>
      </div>
    </div>
  );
}
