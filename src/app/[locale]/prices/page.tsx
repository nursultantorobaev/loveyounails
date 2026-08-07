import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { PRICE_LIST } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Services & Pricing | Love You Nail Salon",
  description:
    "Love You Nail Salon price list — Russian gel manicure, smart pedicure, combos, extensions and nail art. Book online at your nearest studio.",
};

export default function PricesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
      <header className="max-w-2xl">
        <p className="eyebrow">Services &amp; Pricing</p>
        <h1 className="mt-4 text-5xl leading-tight text-espresso md:text-6xl">
          The price of perfect nails
        </h1>
        <p className="mt-5 text-brown leading-relaxed">
          Every service is crafted with premium, non-toxic products and
          medical-grade sterility. Prices marked “from” start at the listed
          amount and vary with length and detail.
        </p>
      </header>

      <div className="mt-14 space-y-14">
        {PRICE_LIST.map((cat) => (
          <section key={cat.title}>
            <div className="flex items-baseline gap-4">
              <h2 className="text-3xl text-espresso">{cat.title}</h2>
              <span className="h-px flex-1 bg-sand" />
            </div>
            <ul className="mt-6 divide-y divide-sand/70">
              {cat.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-6 py-4"
                >
                  <div>
                    <span className="text-lg text-espresso">{item.name}</span>
                    {item.note && (
                      <span className="mt-0.5 block text-xs uppercase tracking-[0.12em] text-brown-soft">
                        {item.note}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 font-display text-2xl text-gold-dark tabular-nums">
                    {item.from && (
                      <span className="mr-1 align-middle text-xs uppercase tracking-[0.14em] text-brown-soft">
                        from
                      </span>
                    )}
                    ${item.price}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Note + CTA */}
      <div className="mt-16 rounded-3xl bg-ivory p-8 text-center md:p-12">
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-brown">
          Same-time combos are performed by two technicians. Prices may vary
          slightly by location; your final quote is confirmed at booking. Have a
          question? Your nearest studio is happy to help.
        </p>
        <div className="mt-7">
          <Button href="/locations">Book at a Studio</Button>
        </div>
      </div>
    </div>
  );
}
