import type { Metadata } from "next";
import { MARKETS } from "@/lib/locations";
import { MEMBERSHIP_TIERS, type MembershipTier } from "@/lib/content";
import MembershipJoin from "@/components/MembershipJoin";

export const metadata: Metadata = {
  title: "Memberships | Love You Nail Salon",
  description:
    "Love You Nail Salon membership program — Gold (10% off), Diamond (15% off) and invitation-only VIP. Billed once a year, valid at your home location.",
};

const CONTACT_EMAIL = "loveyounailsalon@gmail.com";

export default function MembershipsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      {/* Header */}
      <header className="max-w-2xl">
        <p className="eyebrow">Membership Program</p>
        <h1 className="mt-4 text-5xl leading-tight text-espresso md:text-6xl">
          Beauty, rewarded
        </h1>
        <p className="mt-5 text-brown leading-relaxed">
          Join once a year and enjoy members-only savings on every visit. Your
          membership is tied to your home studio, and your discount is applied
          automatically at checkout.
        </p>
      </header>

      {/* Tiers */}
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {MEMBERSHIP_TIERS.map((tier) => (
          <TierCard key={tier.key} tier={tier} />
        ))}
      </div>

      {/* How it works */}
      <section className="mt-24">
        <h2 className="text-3xl text-espresso md:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold text-gold-dark font-display text-lg">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg text-espresso">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brown">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-sand bg-ivory p-6 text-sm leading-relaxed text-brown">
          <span className="font-medium text-espresso">Tied to your location.</span>{" "}
          A membership is valid only at the city where you purchased it — a
          Chicago membership can’t be used in New York or Santa Monica, and vice
          versa. Billed once per year.
        </div>
      </section>

      {/* Gift cards */}
      <section className="mt-24">
        <div className="rounded-3xl bg-espresso px-6 py-14 text-cream md:px-14">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">Gift Cards</p>
            <h2 className="mt-4 text-3xl leading-tight md:text-4xl">
              Give the gift of Love You
            </h2>
            <p className="mt-4 text-cream/70 leading-relaxed">
              A Love You gift card is always the perfect choice. Purchase one for
              your city below.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {MARKETS.map((m) =>
              m.giftCardUrl ? (
                <a
                  key={m.slug}
                  href={m.giftCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-cream px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-espresso transition-colors hover:bg-gold"
                >
                  {m.name} gift card
                </a>
              ) : null,
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const STEPS = [
  {
    title: "Purchase",
    body: "Buy your membership online or in the salon — billed once a year.",
  },
  {
    title: "Linked to your studio",
    body: "Your membership is tied to the city where you bought it.",
  },
  {
    title: "Check in",
    body: "On your visit, we find you by name, phone or email.",
  },
  {
    title: "Discount applied",
    body: "Square automatically applies your member discount at checkout.",
  },
];

function TierCard({ tier }: { tier: MembershipTier }) {
  const isVip = tier.key === "vip";
  const isDiamond = tier.key === "diamond";

  return (
    <div
      className={`flex flex-col rounded-3xl border p-8 ${
        isVip
          ? "border-espresso bg-espresso text-cream"
          : isDiamond
            ? "border-gold bg-cream"
            : "border-sand bg-cream"
      }`}
    >
      <div className="flex items-center gap-3">
        <TierIcon tier={tier.key} />
        <h2
          className={`font-display text-3xl ${isVip ? "text-cream" : "text-espresso"}`}
        >
          {tier.name}
        </h2>
      </div>
      <p
        className={`mt-3 text-sm leading-relaxed ${
          isVip ? "text-cream/70" : "text-brown"
        }`}
      >
        {tier.tagline}
      </p>

      <ul className="mt-6 space-y-3">
        {tier.perks.map((p) => (
          <li
            key={p}
            className={`flex gap-3 text-sm ${isVip ? "text-cream/85" : "text-brown"}`}
          >
            <span className={isVip ? "text-gold" : "text-gold-dark"}>◆</span>
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex-1" />

      {/* Actions */}
      {isVip ? (
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=VIP%20Membership%20Enquiry`}
          className="inline-flex items-center justify-center rounded-full bg-cream px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-gold"
        >
          Contact Us
        </a>
      ) : (
        <MembershipJoin
          tierName={tier.name}
          cities={MARKETS.map((m) => ({
            name: m.name,
            url: m.membership?.[tier.key as "gold" | "diamond"],
          }))}
        />
      )}
    </div>
  );
}

function TierIcon({ tier }: { tier: string }) {
  const cls = tier === "vip" ? "text-gold" : "text-gold-dark";
  if (tier === "diamond") {
    return (
      <svg viewBox="0 0 24 24" className={`h-6 w-6 ${cls}`} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 3h12l3 6-9 12L3 9l3-6z" />
        <path d="M3 9h18M9 3l-1.5 6L12 21l4.5-12L15 3" />
      </svg>
    );
  }
  // crown for gold + vip
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 ${cls}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8l4 3 5-6 5 6 4-3-2 11H5L3 8z" />
    </svg>
  );
}
