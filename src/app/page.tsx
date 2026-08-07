import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import VideoHero from "@/components/VideoHero";
import Reveal from "@/components/Reveal";
import CityScene from "@/components/CityScene";
import StatementShowcase from "@/components/StatementShowcase";
import { MARKETS } from "@/lib/locations";
import { SERVICES, ADVANTAGES, REVIEWS } from "@/lib/content";

export default function Home() {
  return (
    <>
      <VideoHero />
      <About />
      <StatementBand />
      <Services />
      <Portfolio />
      <LocationsPreview />
      <WhyUs />
      <Memberships />
      <Reviews />
      <FinalCta />
    </>
  );
}

/* --------------------------------- About -------------------------------- */
function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal className="order-2 md:order-1">
          <p className="eyebrow">About Love You</p>
          <h2 className="mt-4 text-4xl leading-tight text-espresso md:text-5xl">
            Beauty, elevated to an art form
          </h2>
          <div className="mt-6 space-y-4 text-brown leading-relaxed">
            <p>
              Female-founded with love, Love You Nail Studio grew from a passion
              for artistry, perfection and client comfort.
            </p>
            <p>
              Our signature Russian Manicure and Smart Pedicure are meticulously
              crafted using the finest non-toxic materials — ensuring every
              visit is a seamless blend of beauty, hygiene and well-being.
            </p>
          </div>
        </Reveal>
        <Reveal className="order-1 md:order-2" delay={100}>
          <Media
            src="/media/photos/nails-milky-almond.png"
            alt="A milky almond-shaped manicure resting on silk"
            className="aspect-4/5"
          />
        </Reveal>
      </div>
    </Section>
  );
}

/* --------------------------- Statement showcase ------------------------- */
function StatementBand() {
  const work = [
    { src: "/media/photos/nails-nude-macro.png", alt: "Glossy nude manicure" },
    { src: "/media/photos/nails-pink-pearls.png", alt: "Lilac square nails styled with pearls" },
    { src: "/media/photos/nails-glossy-pink.png", alt: "Glossy pink square manicure" },
    { src: "/media/photos/nails-pink-french.png", alt: "Soft pink French manicure" },
    { src: "/media/photos/nails-red.png", alt: "Bold red manicure" },
    { src: "/media/photos/nails-milky-almond.png", alt: "Milky almond manicure" },
  ];
  return (
    <StatementShowcase images={work}>
      <h2 className="max-w-3xl font-display text-4xl leading-[1.08] text-cream drop-shadow-sm md:text-6xl">
        Every detail considered.
        <br />
        Every finish flawless.
      </h2>
    </StatementShowcase>
  );
}

/* -------------------------------- Services ------------------------------ */
function Services() {
  return (
    <Section id="services" tone="ivory">
      <Reveal>
        <SectionHead
          eyebrow="Professional Nail Care"
          title="Services crafted to perfection"
          intro="From flawless everyday manicures to intricate nail art, every service is delivered with precision and care."
        />
      </Reveal>

      {/* Feature rows */}
      <div className="mt-16 space-y-16">
        <Feature
          src="/media/photos/nails-glossy-pink.png"
          alt="Glossy pink square manicure"
          eyebrow="Manicure"
          title="The signature Russian manicure"
          body="A precise, painless dry manicure with immaculate cuticle work and a high-shine finish that lasts for weeks."
        />
        <Feature
          reverse
          src="/media/photos/pedicure-french.png"
          alt="Neat French pedicure with a toe ring"
          eyebrow="Pedicure"
          title="The Smart Pedicure"
          body="A meticulous, hygienic pedicure that leaves feet soft, healthy and beautifully groomed — down to the smallest detail."
        />
      </div>

      {/* Everything else */}
      <Reveal>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.name} className="rounded-2xl border border-sand bg-cream p-7">
              <h3 className="text-2xl text-espresso">{s.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brown">
                {s.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button href="/prices" variant="outline">
            View Full Price List
          </Button>
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
        <h3 className="mt-3 text-3xl leading-tight text-espresso md:text-4xl">
          {title}
        </h3>
        <p className="mt-4 text-brown leading-relaxed">{body}</p>
      </Reveal>
    </div>
  );
}

/* -------------------------------- Portfolio ----------------------------- */
function Portfolio() {
  const shots = [
    { src: "/media/photos/nails-pink-pearls.png", alt: "Lilac square nails styled with pearls" },
    { src: "/media/photos/nails-red.png", alt: "Bold red manicure" },
    { src: "/media/photos/nails-pink-french.png", alt: "Soft pink French manicure" },
    { src: "/media/photos/nails-milky-almond.png", alt: "Milky almond manicure" },
  ];
  return (
    <Section id="portfolio">
      <Reveal>
        <SectionHead
          eyebrow="Portfolio"
          title="The art of the perfect nail"
          intro="Browse a glimpse of the beauty and creativity that define Love You Nail Salon."
        />
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {shots.map((s, i) => (
          <Reveal key={s.src} delay={i * 80}>
            <Media src={s.src} alt={s.alt} className="aspect-4/5" rounded="rounded-2xl" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- Locations preview ------------------------- */
function LocationsPreview() {
  return (
    <Section id="locations" tone="ivory">
      <Reveal>
        <SectionHead
          eyebrow="Our Locations"
          title="Find your nearest studio"
          intro="One brand, several cities. Choose a location to see services, hours and book with the salon nearest you."
        />
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
                <CityScene
                  city={m.slug}
                  className="aspect-4/3 transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl text-espresso">{m.name}</h3>
                  <p className="mt-1 text-sm text-brown-soft">{m.state}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-brown">
                    {m.tagline}
                  </p>
                  <span className="mt-5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-gold-dark">
                    {m.comingSoon
                      ? "Coming soon"
                      : `${count} ${count === 1 ? "studio" : "studios"} →`}
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
  return (
    <Section id="why-us">
      <Reveal>
        <SectionHead eyebrow="What Makes Us Different" title="The Love You difference" />
      </Reveal>
      <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {ADVANTAGES.map((a, i) => (
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

/* ------------------------------ Memberships ----------------------------- */
function Memberships() {
  return (
    <Section id="memberships">
      <Reveal>
        <div className="overflow-hidden rounded-3xl bg-espresso px-6 py-14 text-center text-cream md:px-16 md:py-20">
          <p className="eyebrow text-gold">Membership Program</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight md:text-5xl">
            The ultimate Love You experience
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/70 leading-relaxed">
            Join once a year for members-only savings on every service, plus
            complimentary touch-ups between visits. Three tiers, tied to your
            home studio.
          </p>
          <div className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <Perk value="Gold" label="10% off every service" />
            <span className="hidden h-8 w-px bg-cream/20 sm:block" />
            <Perk value="Diamond" label="15% off every service" />
            <span className="hidden h-8 w-px bg-cream/20 sm:block" />
            <Perk value="VIP" label="by invitation" />
          </div>
          <div className="mt-10">
            <Button href="/memberships" variant="light">
              Explore Memberships
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
      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-cream/60">
        {label}
      </div>
    </div>
  );
}

/* -------------------------------- Reviews ------------------------------- */
function Reviews() {
  return (
    <Section id="reviews" tone="ivory">
      <Reveal>
        <SectionHead eyebrow="Feedback From Our Customers" title="Loved by many" />
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
                  “{r.quote}”
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
  return (
    <Section id="contact">
      <Reveal className="text-center">
        <p className="eyebrow">Your Style Begins Here</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight text-espresso md:text-5xl">
          The perfect nails for a flawless look
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-brown leading-relaxed">
          Book your appointment at the Love You studio nearest you and experience
          the difference.
        </p>
        <div className="mt-9">
          <Button href="/locations">Choose a Location</Button>
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
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
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
