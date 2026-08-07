import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Wordmark from "./Wordmark";
import { MARKETS } from "@/lib/locations";

export default function Footer() {
  const t = useTranslations("Footer");
  const tc = useTranslations("Common");
  const tn = useTranslations("Nav");

  return (
    <footer className="mt-24 bg-espresso text-cream/80">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Wordmark variant="gold" className="h-20" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
              {t("brandDesc")}
            </p>
            <a
              href="mailto:loveyounailsalon@gmail.com"
              className="mt-4 inline-block text-sm text-gold transition-colors hover:text-cream"
            >
              loveyounailsalon@gmail.com
            </a>
          </div>

          {/* Explore */}
          <FooterCol title={t("explore")}>
            <FooterLink href="/#about">{t("aboutUs")}</FooterLink>
            <FooterLink href="/#services">{t("services")}</FooterLink>
            <FooterLink href="/shop">{tn("shop")}</FooterLink>
            <FooterLink href="/memberships">{tn("memberships")}</FooterLink>
            <FooterLink href="/#reviews">{tn("reviews")}</FooterLink>
          </FooterCol>

          {/* Locations */}
          <FooterCol title={t("locations")}>
            {MARKETS.map((m) => (
              <FooterLink key={m.slug} href={`/locations/${m.slug}`}>
                {m.name}
                {m.comingSoon ? ` — ${tc("comingSoon")}` : ""}
              </FooterLink>
            ))}
          </FooterCol>

          {/* Policies */}
          <FooterCol title={t("policies")}>
            <FooterLink href="/privacy-policy">{t("privacy")}</FooterLink>
            <FooterLink href="/salon-policy">{t("salon")}</FooterLink>
            <FooterLink href="/credits">{t("credits")}</FooterLink>
          </FooterCol>
        </div>

        <div className="gold-rule my-10 opacity-40" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-cream/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} Love You Nail Salon. {t("rights")}
          </p>
          <p className="tracking-[0.2em] uppercase">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-gold">
        {title}
      </h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-cream/70 transition-colors hover:text-gold"
      >
        {children}
      </Link>
    </li>
  );
}
