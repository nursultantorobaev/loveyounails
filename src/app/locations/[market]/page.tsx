import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SalonCard from "@/components/SalonCard";
import CityScene from "@/components/CityScene";
import { MARKETS, getMarket } from "@/lib/locations";

export function generateStaticParams() {
  return MARKETS.map((m) => ({ market: m.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/locations/[market]">): Promise<Metadata> {
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

export default async function MarketPage({
  params,
}: PageProps<"/locations/[market]">) {
  const { market } = await params;
  const m = getMarket(market);
  if (!m) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      {/* Breadcrumb */}
      <Link
        href="/locations"
        className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brown-soft transition-colors hover:text-gold-dark"
      >
        ← All Locations
      </Link>

      {/* City banner */}
      <div className="relative mt-6 overflow-hidden rounded-3xl">
        <CityScene city={m.slug} className="h-52 w-full md:h-72" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-espresso/45 to-transparent p-6 md:p-9">
          <div>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-cream/85">
              {m.state}
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-cream md:text-6xl">
              {m.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Intro */}
      <header className="mt-8 max-w-2xl">
        <p className="text-brown leading-relaxed">{m.tagline}</p>
        {!m.comingSoon && (
          <p className="mt-4 text-sm text-brown-soft">
            Booking through{" "}
            <span className="text-espresso">{bookingLabel[m.bookingSystem]}</span>.
          </p>
        )}
        {!m.comingSoon && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/memberships"
              className="inline-flex items-center rounded-full border border-espresso/25 px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
            >
              Memberships
            </Link>
            {m.giftCardUrl && (
              <a
                href={m.giftCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-espresso/25 px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
              >
                Gift Card
              </a>
            )}
          </div>
        )}
      </header>

      {/* Salons */}
      {m.comingSoon || m.salons.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-dashed border-sand bg-ivory p-12 text-center">
          <h2 className="text-3xl text-espresso">Opening soon</h2>
          <p className="mx-auto mt-4 max-w-md text-brown leading-relaxed">
            We're bringing Love You Nail Salon to {m.name}. Check back shortly —
            or explore our other studios in the meantime.
          </p>
          <Link
            href="/locations"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-espresso px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark"
          >
            View Other Locations
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
  );
}
