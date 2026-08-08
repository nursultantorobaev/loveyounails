import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { MARKETS } from "@/lib/locations";
import { MEMBERSHIP_TIERS, type MembershipTier } from "@/lib/content";
import MembershipJoin from "@/components/MembershipJoin";

export const metadata: Metadata = {
  title: "Memberships | Love You Nail Salon",
  description:
    "Love You Nail Salon membership program — Gold (10% off), Diamond (15% off) and invitation-only VIP. Billed once a year, valid at your home location.",
};

const CONTACT_EMAIL = "loveyounailsalon@gmail.com";

export default async function MembershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MembershipsContent />;
}

function MembershipsContent() {
  const t = useTranslations("Memberships");
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      {/* Header */}
      <header className="max-w-2xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-4 text-5xl uppercase leading-tight text-espresso md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-brown leading-relaxed">{t("intro")}</p>
      </header>

      {/* Tiers */}
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {MEMBERSHIP_TIERS.map((tier) => (
          <TierCard key={tier.key} tier={tier} />
        ))}
      </div>

      {/* How it works */}
      <section className="mt-24">
        <h2 className="text-3xl text-espresso md:text-4xl">
          {t("howItWorksTitle")}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold text-gold-dark font-display text-lg">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg text-espresso">{t(`step${i}Title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brown">
                {t(`step${i}Body`)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-sand bg-ivory p-6 text-sm leading-relaxed text-brown">
          <span className="font-medium text-espresso">{t("tiedTitle")}</span>{" "}
          {t("tiedBody")}
        </div>
      </section>

      {/* Gift cards */}
      <section className="mt-24">
        <div className="rounded-3xl bg-espresso px-6 py-14 text-cream md:px-14">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">{t("giftEyebrow")}</p>
            <h2 className="mt-4 text-3xl leading-tight md:text-4xl">
              {t("giftTitle")}
            </h2>
            <p className="mt-4 text-cream/70 leading-relaxed">{t("giftBody")}</p>
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
                  {t("cityGiftCard", { city: m.name })}
                </a>
              ) : null,
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function TierCard({ tier }: { tier: MembershipTier }) {
  const t = useTranslations("Memberships");
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
        {t(`tiers.${tier.key}.tagline`)}
      </p>

      <ul className="mt-6 space-y-3">
        {["perk0", "perk1"].map((p) => (
          <li
            key={p}
            className={`flex gap-3 text-sm ${isVip ? "text-cream/85" : "text-brown"}`}
          >
            <span className={isVip ? "text-gold" : "text-gold-dark"}>◆</span>
            {t(`tiers.${tier.key}.${p}`)}
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
          {t("contactUs")}
        </a>
      ) : (
        <MembershipJoin
          heading={t("joinInCity")}
          options={MARKETS.map((m) => ({
            key: m.slug,
            label: m.name,
            cityName: m.name,
            tierName: tier.name,
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
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 ${cls}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8l4 3 5-6 5 6 4-3-2 11H5L3 8z" />
    </svg>
  );
}
