import { getTranslations } from "next-intl/server";

type FaqItem = { q: string; a: string };

/**
 * Per-market FAQ for a location page. Content lives in messages/*.json under
 * `Faq.markets.<market-slug>` (translated per locale). Renders the visible Q&A
 * plus FAQPage JSON-LD (server-rendered so crawlers and AI assistants read it).
 * Returns null when the market has no FAQ configured.
 */
export default async function Faq({ market }: { market: string }) {
  const t = await getTranslations("Faq");
  const items = (t.raw(`markets.${market}`) ?? []) as FaqItem[];
  if (!Array.isArray(items) || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section id="faq" className="mt-16 border-t border-sand pt-12 md:mt-20">
      <h2 className="font-display text-3xl uppercase leading-tight text-espresso md:text-4xl">
        {t("heading")}
      </h2>
      <dl className="mt-8 divide-y divide-sand">
        {items.map((it, i) => (
          <div key={i} className="py-5">
            <dt className="font-medium text-espresso">{it.q}</dt>
            <dd className="mt-2 text-brown leading-relaxed">{it.a}</dd>
          </div>
        ))}
      </dl>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
