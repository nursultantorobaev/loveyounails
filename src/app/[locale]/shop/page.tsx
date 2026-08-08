import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import ProductImage from "@/components/ProductImage";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop | Love You Nail Salon",
  description:
    "The Love You professional product line — premium gel polish, nail care and tools. Launching soon.",
};

const CONTACT_EMAIL = "loveyounailsalon@gmail.com";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ShopContent />;
}

function ShopContent() {
  const t = useTranslations("Shop");
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      {/* Header */}
      <header className="max-w-2xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-4 text-5xl uppercase leading-tight text-espresso md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-brown leading-relaxed">{t("intro")}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Notify%20me%20when%20the%20Love%20You%20line%20launches`}
          className="mt-7 inline-flex items-center rounded-full bg-espresso px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark"
        >
          {t("notify")}
        </a>
      </header>

      {/* Products */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => {
          const name = t(`products.${p.slug}.name`);
          const variant = t(`products.${p.slug}.variant`);
          return (
            <article
              key={p.slug}
              className="group flex flex-col overflow-hidden rounded-3xl border border-sand bg-cream"
            >
              <div className="relative">
                <ProductImage kind={p.kind} className="aspect-square w-full" />
                <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-gold-dark">
                  {t("comingSoon")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-brown-soft">
                  {t(`categories.${p.category}`)}
                </p>
                <h2 className="mt-2 text-2xl text-espresso">{name}</h2>
                {variant && (
                  <p className="text-sm italic text-brown-soft">{variant}</p>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brown">
                  {t(`products.${p.slug}.description`)}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-display text-2xl text-gold-dark">
                    ${p.price}
                  </span>
                  <span
                    className="cursor-not-allowed rounded-full border border-sand px-5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-brown-soft"
                    aria-disabled="true"
                  >
                    {t("notifyMe")}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-12 text-sm text-brown-soft">{t("note")}</p>
    </div>
  );
}
