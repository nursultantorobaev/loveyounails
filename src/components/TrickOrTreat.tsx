"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { MARKETS } from "@/lib/locations";

// Halloween "Trick or treat" game: a pumpkin bottom-left opens a modal, the visitor
// picks a city, taps the pumpkin and gets that city's real offer. The treats mirror the
// admins' Promos sheet (Halloween Nails in Chicago, the October first-visit offers in NY
// and Santa Monica) — change them together.
//
// Shown Oct 15–31 only (visitor's local date), so it switches itself on and off every
// year. Add ?halloween=1 to any URL to preview it outside those dates.
const SEASON = { fromMonth: 10, fromDay: 15, toMonth: 10, toDay: 31 };
const PREVIEW_KEY = "lyn-halloween-preview";

type CitySlug = "chicago" | "new-york" | "santa-monica";
const TREATS: Record<CitySlug, { code?: string }> = {
  chicago: { code: "Halloween Nails" },
  "new-york": {},
  "santa-monica": {},
};
const CITIES = MARKETS.filter((m) => m.slug in TREATS && m.salons.length);

type Phase = "pick" | "shake" | "trick" | "treat";

function inSeason(d = new Date()): boolean {
  const md = (d.getMonth() + 1) * 100 + d.getDate();
  return md >= SEASON.fromMonth * 100 + SEASON.fromDay && md <= SEASON.toMonth * 100 + SEASON.toDay;
}

function previewOn(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("halloween") === "1") {
      sessionStorage.setItem(PREVIEW_KEY, "1");
    }
    return sessionStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
}

export default function TrickOrTreat() {
  const t = useTranslations("Halloween");
  const pathname = usePathname();
  const pageCity = CITIES.find((m) => pathname.startsWith(`/locations/${m.slug}`))?.slug as CitySlug | undefined;

  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState<CitySlug | undefined>(undefined);
  const [phase, setPhase] = useState<Phase>("pick");
  const [copied, setCopied] = useState(false);

  // Decide on the client (the visitor's own date), after hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only date check
    setEnabled(inSeason() || previewOn());
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // pick → shake (pumpkin wobbles) → trick ("Trick… 👻") → treat (the offer)
  useEffect(() => {
    if (phase === "shake") {
      const id = setTimeout(() => setPhase("trick"), 900);
      return () => clearTimeout(id);
    }
    if (phase === "trick") {
      const id = setTimeout(() => setPhase("treat"), 1300);
      return () => clearTimeout(id);
    }
  }, [phase]);

  if (!enabled) return null;

  function openGame() {
    setCity((c) => c ?? pageCity);
    setPhase("pick");
    setCopied(false);
    setOpen(true);
  }

  function reveal() {
    if (!city) return;
    setPhase("shake");
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the phrase is on screen anyway */
    }
  }

  const market = MARKETS.find((m) => m.slug === city);
  const treat = city ? TREATS[city] : undefined;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openGame}
          aria-label={t("button")}
          className="fixed bottom-5 left-5 z-[79] flex items-center gap-2 rounded-full bg-espresso py-2 pl-2 pr-2 text-cream shadow-lg transition-colors hover:bg-gold-dark sm:pr-4"
        >
          <Pumpkin className="h-9 w-9 animate-[pumpkin-bob_2.6s_ease-in-out_infinite] motion-reduce:animate-none" />
          <span className="hidden text-[0.72rem] font-medium uppercase tracking-[0.16em] sm:inline">{t("button")}</span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-espresso/70 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tot-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-espresso px-6 pb-8 pt-10 text-center text-cream sm:rounded-3xl sm:px-9"
            onClick={(e) => e.stopPropagation()}
          >
            <Bats />
            <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#d9772b]/25 blur-3xl" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="absolute right-4 top-3 z-10 text-2xl leading-none text-cream/60 transition-colors hover:text-cream"
            >
              ×
            </button>

            <div className="relative" aria-live="polite">
              <p className="eyebrow text-gold">{t("eyebrow")}</p>

              {phase !== "treat" ? (
                <>
                  <h2 id="tot-title" className="mt-3 font-display text-4xl leading-tight">
                    {phase === "trick" ? t("trick") : t("title")}
                  </h2>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
                    {phase === "trick" ? " " : t("intro")}
                  </p>

                  {phase === "pick" && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {CITIES.map((m) => (
                        <button
                          key={m.slug}
                          type="button"
                          onClick={() => setCity(m.slug as CitySlug)}
                          aria-pressed={city === m.slug}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            city === m.slug
                              ? "border-gold bg-gold text-espresso"
                              : "border-cream/25 text-cream/85 hover:border-gold hover:text-gold"
                          }`}
                        >
                          {m.salons[0].city}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={reveal}
                    disabled={!city || phase !== "pick"}
                    aria-label={t("tapPumpkin")}
                    className="group mx-auto mt-7 block disabled:cursor-default"
                  >
                    <Pumpkin
                      glow={phase !== "pick"}
                      className={`mx-auto h-36 w-36 transition-transform ${
                        phase === "shake"
                          ? "animate-[pumpkin-shake_0.45s_ease-in-out_2]"
                          : phase === "trick"
                            ? "scale-110"
                            : city
                              ? "animate-[pumpkin-bob_2.6s_ease-in-out_infinite] group-hover:scale-105 motion-reduce:animate-none"
                              : "opacity-60"
                      }`}
                    />
                  </button>
                  {phase === "pick" && (
                    <p className="mt-3 text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                      {city ? t("tapPumpkin") : t("pickCityFirst")}
                    </p>
                  )}
                </>
              ) : (
                market && city && (
                  <div className="animate-[treat-pop_0.5s_ease-out]">
                    <p className="mt-3 font-display text-2xl text-cream/85">{t("gotcha")}</p>
                    <p id="tot-title" className="mt-4 font-display text-6xl leading-none text-[#e8914a]">
                      {t(`treats.${city}.deal`)}
                    </p>
                    <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-cream">
                      {t(`treats.${city}.what`)}
                    </p>

                    {treat?.code && (
                      <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-dashed border-gold/60 px-4 py-3">
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">{t("magicWords")}</p>
                        <div className="mt-1 flex items-center justify-center gap-3">
                          <span className="font-display text-2xl">{treat.code}</span>
                          <button
                            type="button"
                            onClick={() => copyCode(treat.code!)}
                            className="rounded-full border border-cream/25 px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-cream/80 transition-colors hover:border-gold hover:text-gold"
                          >
                            {copied ? t("copied") : t("copy")}
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="mx-auto mt-4 max-w-xs text-xs leading-relaxed text-cream/60">
                      {t(`treats.${city}.how`)} {t("until")}
                    </p>

                    {market.salons.length > 1 ? (
                      <Link
                        href={`/locations/${market.slug}`}
                        onClick={() => setOpen(false)}
                        className="mt-6 inline-block rounded-full bg-cream px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-gold"
                      >
                        {t("book")}
                      </Link>
                    ) : (
                      <a
                        href={market.salons[0].bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block rounded-full bg-cream px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-gold"
                      >
                        {t("book")}
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => { setPhase("pick"); setCopied(false); }}
                      className="mx-auto mt-4 block text-xs text-cream/60 underline-offset-4 hover:text-cream hover:underline"
                    >
                      {t("again")}
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Jack-o'-lantern in the site palette: burnt orange body, gold stem, espresso face. */
function Pumpkin({ className = "", glow = false }: { className?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M33 14c0-4 2-7 6-8" stroke="#c6a15b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="20" cy="38" rx="13" ry="18" fill="#c8641f" />
      <ellipse cx="44" cy="38" rx="13" ry="18" fill="#c8641f" />
      <ellipse cx="32" cy="38" rx="14" ry="20" fill="#e07a2c" />
      <path d="M32 18v40M22 21c-3 5-3 29 0 34M42 21c3 5 3 29 0 34" stroke="#b5561a" strokeWidth="1.2" fill="none" opacity="0.6" />
      <g fill={glow ? "#ffd27a" : "#3a2e24"}>
        <path d="M21 33l5-4 3 5z" />
        <path d="M43 33l-5-4-3 5z" />
        <path d="M24 44c4 4 12 4 16 0l-2 5-3-2-3 3-3-3-3 2z" />
      </g>
    </svg>
  );
}

/** Two small gold bats drifting across the top of the modal. */
function Bats() {
  const bat = "M0 4c2-3 4-3 6-1 1-2 3-2 4 0 1-2 3-2 4 0 2-2 4-2 6 1-3 0-5 1-6 3-1-1-2-1-3 0-1-1-2-1-3 0-1-1-2-1-3 0-1-2-3-3-5-3z";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 motion-reduce:hidden">
      <svg viewBox="0 0 20 8" className="absolute left-0 top-6 h-3 w-8 animate-[bat-fly_9s_linear_infinite] fill-gold/70">
        <path d={bat} />
      </svg>
      <svg viewBox="0 0 20 8" className="absolute left-0 top-14 h-2 w-6 animate-[bat-fly_12s_linear_infinite_3s] fill-gold/50">
        <path d={bat} />
      </svg>
    </div>
  );
}
