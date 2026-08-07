"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MEMBERSHIP_TERMS } from "@/lib/membershipTerms";

interface City {
  name: string;
  url?: string;
}

/**
 * Per-city "Join" buttons for a paid tier. Clicking a city opens the Membership
 * Terms & Conditions; the customer must tick acknowledgment before "Agree &
 * Continue" sends them to that city's checkout link.
 */
export default function MembershipJoin({
  tierName,
  cities,
}: {
  tierName: string;
  cities: City[];
}) {
  const [target, setTarget] = useState<City | null>(null);
  const [agreed, setAgreed] = useState(false);

  // lock body scroll while modal is open
  useEffect(() => {
    if (target) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [target]);

  const open = (c: City) => {
    setAgreed(false);
    setTarget(c);
  };
  const close = () => setTarget(null);

  const proceed = () => {
    if (target?.url && agreed) {
      window.open(target.url, "_blank", "noopener,noreferrer");
      close();
    }
  };

  return (
    <div>
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-brown-soft">
        Join in your city
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {cities.map((c) =>
          c.url ? (
            <button
              key={c.name}
              type="button"
              onClick={() => open(c)}
              className="inline-flex items-center rounded-full bg-espresso px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-gold-dark"
            >
              {c.name}
            </button>
          ) : (
            <span
              key={c.name}
              title="Available in salon"
              className="inline-flex items-center rounded-full border border-sand px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-brown-soft"
            >
              {c.name} — in salon
            </span>
          ),
        )}
      </div>

      {target && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-espresso/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Membership Terms and Conditions"
          onClick={close}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-cream sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-sand px-6 py-5">
              <div>
                <p className="eyebrow">{tierName} Membership · {target.name}</p>
                <h2 className="mt-1 font-display text-2xl text-espresso">
                  {MEMBERSHIP_TERMS.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="shrink-0 text-2xl leading-none text-brown-soft hover:text-espresso"
              >
                ×
              </button>
            </div>

            {/* Scrollable terms */}
            <div className="flex-1 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-brown">
              <p>{MEMBERSHIP_TERMS.intro}</p>
              {MEMBERSHIP_TERMS.sections.map((s) => (
                <section key={s.title} className="mt-5">
                  <h3 className="text-base font-medium text-espresso">{s.title}</h3>
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="mt-1.5">
                      {p}
                    </p>
                  ))}
                </section>
              ))}

              <section className="mt-6 rounded-2xl bg-ivory p-4">
                <p className="text-espresso">{MEMBERSHIP_TERMS.acknowledgmentIntro}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {MEMBERSHIP_TERMS.acknowledgments.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </section>

              <Link
                href="/memberships/terms"
                target="_blank"
                className="mt-4 inline-block text-xs uppercase tracking-[0.14em] text-gold-dark underline underline-offset-4"
              >
                Open full terms / download PDF
              </Link>
            </div>

            {/* Footer: acknowledge + continue */}
            <div className="border-t border-sand px-6 py-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-espresso">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-gold-dark)]"
                />
                <span>{MEMBERSHIP_TERMS.confirmLabel}</span>
              </label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={proceed}
                  disabled={!agreed}
                  className="inline-flex items-center justify-center rounded-full bg-espresso px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Agree &amp; Continue
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-full border border-espresso/25 px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
