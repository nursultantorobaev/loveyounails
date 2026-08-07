import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import VideoHero from "@/components/VideoHero";
import Reveal from "@/components/Reveal";
import CityPhoto from "@/components/CityPhoto";
import StatementShowcase from "@/components/StatementShowcase";
import ProductImage from "@/components/ProductImage";
import { MARKETS } from "@/lib/locations";
import { REVIEWS } from "@/lib/content";
import { PRODUCTS } from "@/lib/products";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <VideoHero />
      <About />
      <StatementBand />
      <Services />
      <Portfolio />
      <LocationsPreview />
      <WhyUs />
      <ProductsTeaser />
      <Memberships />
      <Reviews />
      <FinalCta />
    </>
  );
}

/* --------------------------------- About -------------------------------- */
function About() {
  const t = useTranslations("About");
  return (
    <Section id="about">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal className="order-2 md:order-1">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 text-4xl leading-tight text-espresso md:text-5xl">
            {t("title")}
          </h2>
          <div className="mt-6 space-y-4 text-brown leading-relaxed">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>
        </Reveal>
        <Reveal className="order-1 md:order-2" delay={100}>
          <Media
            src="/media/photos/nails-milky-almond.png"
            alt={t("title")}
            className="aspect-4/5"
          />
        </Reveal>
      </div>
    </Section>
  );
}

/* --------------------------- Statement showcase ------------------------- */
function StatementBand() {
  const t = useTranslations("Statement");
  const work = [
    { src: "/media/photos/nails-nude-macro.png", alt: "" },
    { src: "/media/photos/nails-pink-pearls.png", alt: "" },
    { src: "/media/photos/nails-glossy-pink.png", alt: "" },
    { src: "/media/photos/nails-pink-french.png", alt: "" },
    { src: "/media/photos/nails-red.png", alt: "" },
    { src: "/media/photos/nails-milky-almond.png", alt: "" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <StatementShowcase images={work}>
        <h2 className="max-w-3xl font-display text-4xl leading-[1.08] text-cream drop-shadow-sm md:text-6xl">
          {t("line1")}
          <br />
          {t("line2")}
        </h2>
      </StatementShowcase>
    </div>
  );
}

/* -------------------------------- Services ------------------------------ */
function Services() {
  const t = useTranslations("Services");
  const list = t.raw("list") as { name: string; description: string }[];
  return (
    <Section id="services" tone="ivory">
      <Reveal>
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      </Reveal>

      <div className="mt-16 space-y-16">
        <Feature
          src="/media/photos/nails-glossy-pink.png"
          alt={t("manicureTitle")}
          eyebrow={t("manicureEyebrow")}
          title={t("manicureTitle")}
          body={t("manicureBody")}
        />
        <Feature
          reverse
          src="/media/photos/pedicure-french.png"
          alt={t("pedicureTitle")}
          eyebrow={t("pedicureEyebrow")}
          title={t("pedicureTitle")}
          body={t("pedicureBody")}
        />
      </div>

      <Reveal>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <div key={s.name} className="rounded-2xl border border-sand bg-cream p-7">
              <h3 className="text-2xl text-espresso">{s.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brown">{s.description}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

function Feature({
  src,
  alt,
  eyebrow,
  title,
  body,
  reverse = false,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      <Reveal className={reverse ? "md:order-2" : ""}>
        <Media src={src} alt={alt} className="aspect-4/3" />
      </Reveal>
      <Reveal delay={100} className={reverse ? "md:order-1" : ""}>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-3 text-3xl leading-tight text-espresso md:text-4xl">{title}</h3>
        <p className="mt-4 text-brown leading-relaxed">{body}</p>
      </Reveal>
    </div>
  );
}

/* -------------------------------- Portfolio ----------------------------- */
function Portfolio() {
  const t = useTranslations("Portfolio");
  const shots = [
    "/media/photos/nails-pink-pearls.png",
    "/media/photos/nails-red.png",
    "/media/photos/nails-pink-french.png",
    "/media/photos/nails-milky-almond.png",
  ];
  return (
    <Section id="portfolio">
      <Reveal>
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {shots.map((src, i) => (
          <Reveal key={src} delay={i * 80}>
            <Media src={src} alt="" className="aspect-4/5" rounded="rounded-2xl" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- Locations preview ------------------------- */
function LocationsPreview() {
  const t = useTranslations("LocationsPreview");
  const tm = useTranslations("Markets");
  const tc = useTranslations("Common");
  return (
    <Section id="locations" tone="ivory">
      <Reveal>
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {MARKETS.map((m, i) => {
          const count = m.salons.length;
          return (
            <Reveal key={m.slug} delay={i * 90}>
              <Link
                href={`/locations/${m.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sand bg-cream transition-shadow hover:shadow-lg hover:shadow-espresso/5"
              >
                <CityPhoto
                  city={m.slug}
                  className="aspect-4/3 transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl text-espresso">{m.name}</h3>
                  <p className="mt-1 text-sm text-brown-soft">{tm(`states.${m.slug}`)}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-brown">
                    {tm(`taglines.${m.slug}`)}
                  </p>
                  <span className="mt-5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-gold-dark">
                    {m.comingSoon
                      ? tc("comingSoon")
                      : `${t("viewStudios", { count })} →`}
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* --------------------------------- Why Us ------------------------------- */
function WhyUs() {
  const t = useTranslations("WhyUs");
  const list = t.raw("list") as { title: string; description: string }[];
  return (
    <Section id="why-us">
      <Reveal>
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
      </Reveal>
      <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((a, i) => (
          <Reveal key={a.title} delay={i * 80}>
            <span className="font-display text-3xl text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-xl text-espresso">{a.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brown">{a.description}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- Products teaser --------------------------- */
function ProductsTeaser() {
  const t = useTranslations("ProductsTeaser");
  return (
    <Section id="products" tone="ivory">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 text-4xl leading-tight text-espresso md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md text-brown leading-relaxed">{t("body")}</p>
          <div className="mt-8">
            <Button href="/shop">{t("cta")}</Button>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-3 gap-3">
            {PRODUCTS.slice(0, 3).map((p) => (
              <div key={p.slug} className="overflow-hidden rounded-2xl border border-sand">
                <ProductImage kind={p.kind} className="aspect-square w-full" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------ Memberships ----------------------------- */
function Memberships() {
  const t = useTranslations("MembershipsTeaser");
  return (
    <Section id="memberships">
      <Reveal>
        <div className="overflow-hidden rounded-3xl bg-espresso px-6 py-14 text-center text-cream md:px-16 md:py-20">
          <p className="eyebrow text-gold">{t("eyebrow")}</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/70 leading-relaxed">{t("body")}</p>
          <div className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <Perk value={t("gold")} label={t("goldPerk")} />
            <span className="hidden h-8 w-px bg-cream/20 sm:block" />
            <Perk value={t("diamond")} label={t("diamondPerk")} />
            <span className="hidden h-8 w-px bg-cream/20 sm:block" />
            <Perk value={t("vip")} label={t("vipPerk")} />
          </div>
          <div className="mt-10">
            <Button href="/memberships" variant="light">
              {t("cta")}
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Perk({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl text-gold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-cream/60">{label}</div>
    </div>
  );
}

/* -------------------------------- Reviews ------------------------------- */
function Reviews() {
  const t = useTranslations("Reviews");
  const quotes = t.raw("list") as string[];
  return (
    <Section id="reviews" tone="ivory">
      <Reveal>
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => {
          const initials = r.name
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <Reveal key={r.name} delay={(i % 3) * 90}>
              <figure className="flex h-full flex-col rounded-2xl border border-sand bg-cream p-7">
                <div className="text-gold" aria-hidden>
                  ★★★★★
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brown">
                  “{quotes[i]}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {r.avatar ? (
                    <Image
                      src={r.avatar}
                      alt={r.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand font-display text-sm text-gold-dark"
                    >
                      {initials}
                    </span>
                  )}
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-espresso">
                    {r.name}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------- Final CTA ------------------------------ */
function FinalCta() {
  const t = useTranslations("FinalCta");
  return (
    <Section id="contact">
      <Reveal className="text-center">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight text-espresso md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-brown leading-relaxed">{t("body")}</p>
        <div className="mt-9">
          <Button href="/locations">{t("cta")}</Button>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------ Primitives ------------------------------ */
function Media({
  src,
  alt,
  className = "",
  rounded = "rounded-3xl",
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${rounded} ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
    </div>
  );
}

function Section({
  id,
  tone,
  children,
}: {
  id?: string;
  tone?: "ivory";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${tone === "ivory" ? "bg-ivory" : ""}`}>
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">{children}</div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-4xl leading-tight text-espresso md:text-5xl">{title}</h2>
      {intro && <p className="mt-5 text-brown leading-relaxed">{intro}</p>}
    </div>
  );
}
