"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { buildSearchIndex, searchIndex, type SearchEntry, type SearchGroup } from "@/lib/search";

// Shown before the visitor types anything.
const SUGGESTED = ["promo", "locations", "gift-cards", "sterilization", "groups", "memberships"];

export const OPEN_SEARCH_EVENT = "lyn:open-search";

function SearchIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" strokeLinecap="round" />
    </svg>
  );
}

/** The magnifier button in the header. Opens the (single) search panel. */
export function SearchButton({ className = "" }: { className?: string }) {
  const t = useTranslations("Search");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
      aria-label={t("open")}
      className={`flex h-10 w-10 items-center justify-center text-espresso transition-colors hover:text-gold-dark ${className}`}
    >
      <SearchIcon />
    </button>
  );
}

/**
 * Site-wide search panel: type a word, get live suggestions grouped by type
 * (pages, locations, services, FAQ, shop, policies). Keyboard: "/" or Ctrl/⌘+K
 * opens, ↑/↓ move, Enter opens, Esc closes.
 */
export default function SiteSearch() {
  const t = useTranslations("Search");
  const messages = useMessages();
  const router = useRouter();
  const index = useMemo(() => buildSearchIndex(messages), [messages]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: SearchEntry[] = useMemo(() => {
    if (query.trim()) return searchIndex(index, query);
    return SUGGESTED.map((id) => index.find((e) => e.id === id)).filter((e): e is SearchEntry => !!e);
  }, [index, query]);

  // Group results by type; the group holding the best match comes first, so the
  // top suggestion (and Enter) is always the most relevant one. `results` is
  // already sorted by score, so first appearance = best match per group.
  const grouped = useMemo(() => {
    if (!query.trim()) return [{ group: null as SearchGroup | null, items: results }];
    const order = [...new Set(results.map((r) => r.group))];
    return order.map((g) => ({ group: g as SearchGroup | null, items: results.filter((r) => r.group === g) }));
  }, [results, query]);
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    const show = () => { setOpen(true); setQuery(""); setActive(0); };
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, [contenteditable=true]");
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      cancelAnimationFrame(id);
    };
  }, [open]);

  function go(r: SearchEntry) {
    setOpen(false);
    if (r.action === "promo") {
      window.dispatchEvent(new Event("lyn:open-promo"));
      return;
    }
    if (!r.href) return;
    router.push(r.href);
    // Same-page anchors (e.g. an FAQ on the page you're on) don't fire a
    // hashchange with client navigation — nudge listeners like the FAQ opener.
    setTimeout(() => window.dispatchEvent(new HashChangeEvent("hashchange")), 350);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && flat[active]) { e.preventDefault(); go(flat[active]); }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] bg-espresso/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t("open")}
      onClick={() => setOpen(false)}
    >
      <div className="mx-auto w-full max-w-3xl bg-cream shadow-xl sm:mt-16 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-sand px-5 py-4">
          <SearchIcon className="h-5 w-5 shrink-0 text-brown-soft" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onInputKey}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            aria-controls="site-search-results"
            aria-activedescendant={flat[active] ? `sr-${flat[active].id}` : undefined}
            className="min-w-0 flex-1 bg-transparent text-base text-espresso placeholder:text-brown-soft focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="shrink-0 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-brown-soft hover:text-espresso"
          >
            {t("close")}
          </button>
        </div>

        {/* Results */}
        <div id="site-search-results" role="listbox" className="max-h-[calc(100dvh-5rem)] overflow-y-auto px-2 py-3 sm:max-h-[65vh]">
          {flat.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-brown">{t("noResults", { query: query.trim() })}</p>
          ) : (
            grouped.map(({ group, items }) => (
              <div key={group ?? "suggested"} className="mb-2">
                <p className="px-4 pb-1 pt-2 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-gold-dark">
                  {group ? t(`groups.${group}`) : t("suggested")}
                </p>
                {items.map((r) => {
                  const i = flat.indexOf(r);
                  return (
                    <button
                      key={r.id}
                      id={`sr-${r.id}`}
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r)}
                      className={`block w-full rounded-2xl px-4 py-2.5 text-left transition-colors ${i === active ? "bg-ivory" : ""}`}
                    >
                      <span className="block text-sm font-medium text-espresso">{r.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-brown-soft">{r.snippet}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <p className="hidden border-t border-sand px-5 py-2.5 text-[0.65rem] text-brown-soft sm:block">{t("hint")}</p>
      </div>
    </div>
  );
}
