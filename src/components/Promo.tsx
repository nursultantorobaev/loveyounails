"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PROMO, promoSalons } from "@/lib/promo";

// After the visitor closes the popup, don't open it again for this long.
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
// Let the first-load brand intro (~2.7s) finish before the popup appears.
const OPEN_DELAY_MS = 3200;
const storageKey = `lyn-promo-${PROMO.id}-closed`;

function recentlyClosed(): boolean {
  try {
    const at = Number(localStorage.getItem(storageKey));
    return Number.isFinite(at) && at > 0 && Date.now() - at < SNOOZE_MS;
  } catch {
    return false; // storage blocked (private mode etc.) → just show it
  }
}

function rememberClosed() {
  try {
    localStorage.setItem(storageKey, String(Date.now()));
  } catch {
    /* storage blocked — the popup may reappear next visit, which is fine */
  }
}

/**
 * Site-wide promo: a slim bar above the header on every page, plus a popup that
 * opens once on a visitor's first page view (then stays closed for 2 weeks).
 * The bar's "Details" button reopens the popup any time.
 */
export default function Promo() {
  const t = useTranslations("Promo");
  const [open, setOpen] = useState(false);
  const salons = promoSalons();

  // Search results can open the popup directly.
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("lyn:open-promo", show);
    return () => window.removeEventListener("lyn:open-promo", show);
  }, []);

  useEffect(() => {
    if (!PROMO.enabled || recentlyClosed()) return;
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!PROMO.enabled || salons.length === 0) return null;

  function close() {
    rememberClosed();
    setOpen(false);
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-espresso text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2 text-center text-[0.72rem] tracking-[0.06em] md:px-8">
          <span>{t("bar")}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="font-medium uppercase tracking-[0.16em] text-gold underline-offset-4 transition-colors hover:text-cream hover:underline"
          >
            {t("details")} →
          </button>
        </div>
      </div>

      {/* Popup */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-espresso/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-title"
          onClick={close}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-cream px-6 pb-7 pt-9 text-center sm:rounded-3xl sm:px-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute right-4 top-3 text-2xl leading-none text-brown-soft transition-colors hover:text-espresso"
            >
              ×
            </button>

            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 id="promo-title" className="mt-3 font-display text-5xl leading-none text-espresso">
              {t("headline")}
            </h2>
            <p className="mt-2 font-display text-2xl text-espresso">{t("subhead")}</p>
            <span className="mx-auto mt-5 block h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <p className="mt-5 text-sm leading-relaxed text-brown">{t("body")}</p>

            <div className="mt-6 flex flex-col gap-3">
              {salons.map(({ key, salon }) => (
                <a
                  key={key}
                  href={salon.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={rememberClosed}
                  className="flex flex-col items-center rounded-2xl bg-espresso px-5 py-3 text-cream transition-colors hover:bg-gold-dark"
                >
                  <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em]">
                    {t(`book.${key.replace("/", "_")}`)}
                  </span>
                  <span className="mt-0.5 text-xs text-cream/75">
                    {salon.address}, {salon.city}
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-5 text-xs text-brown-soft">{t("terms")}</p>
          </div>
        </div>
      )}
    </>
  );
}
