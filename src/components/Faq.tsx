import { getTranslations } from "next-intl/server";

type FaqItem = { q: string; a: string };

/**
 * Per-market FAQ for a location page, as an accordion (click a question to
 * expand/collapse). Uses native <details>/<summary> so it works without client
 * JS and keeps every answer in the DOM (good for the FAQPage JSON-LD, crawlers
 * and AI assistants). Content lives in messages/*.json under
 * `Faq.markets.<market-slug>` (translated per locale). Null when no FAQ.
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
      <div className="mt-8 border-t border-sand">
        {items.map((it, i) => (
          <details key={i} className="group border-b border-sand">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-espresso transition-colors hover:text-gold-dark [&::-webkit-details-marker]:hidden">
              <span>{it.q}</span>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 flex-shrink-0 text-brown-soft transition-transform duration-200 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="pb-5 pr-8 text-brown leading-relaxed">{it.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
