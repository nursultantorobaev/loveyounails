"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeNames } from "@/i18n/routing";

/** EN · RU · ES locale switcher — keeps the current path, swaps the locale. */
export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`flex items-center gap-2 text-[0.7rem] font-medium ${className}`}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && <span className="text-brown-soft/40">·</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={loc === locale}
            className={`uppercase tracking-[0.1em] transition-colors ${
              loc === locale
                ? "text-espresso"
                : "text-brown-soft hover:text-gold-dark"
            }`}
          >
            {localeNames[loc]}
          </button>
        </span>
      ))}
    </div>
  );
}
