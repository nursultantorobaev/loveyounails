"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { MARKETS } from "@/lib/locations";

// The same AI assistant as on Instagram, served by the agent server on Render.
const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API ?? "https://loveyou-ai-tools.onrender.com";
const STORE_KEY = "lyn-chat-v1";
const KEEP_MS = 24 * 60 * 60 * 1000; // a chat survives page changes and reloads for a day

type Msg = { role: "user" | "assistant"; text: string };
interface Saved { sessionId: string; city: string; messages: Msg[]; at: number }

const CITIES = MARKETS.filter((m) => !m.comingSoon && m.salons.length).map((m) => ({
  slug: m.slug,
  name: m.salons[0].city, // "Chicago", "New York", "Santa Monica"
}));

function newSessionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    return Date.now() - s.at < KEEP_MS ? s : null;
  } catch {
    return null;
  }
}

function save(s: Saved) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    /* storage blocked — the chat still works for this page view */
  }
}

/** Link text: short links as-is, long ones (Square booking pages) as "host/…". */
function shortLink(url: string): string {
  const bare = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return bare.length <= 36 ? bare : `${bare.split("/")[0]}/…`;
}

/** Turns URLs (and bare loveyou.club/… links) into links, **bold** into bold. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+|loveyou\.club\/[^\s),.]*[^\s),.!?]|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^https?:\/\//.test(p) || /^loveyou\.club\//.test(p)) {
          const href = p.startsWith("http") ? p : `https://${p}`;
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap underline underline-offset-2">
              {shortLink(p)}
            </a>
          );
        }
        if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

/**
 * Floating chat with the Love You AI assistant. Bottom-right on every page. The city
 * comes from the page (a city's location page) or is picked once; the conversation is
 * kept in this browser for a day so it survives moving between pages.
 */
export default function ChatWidget() {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const pathname = usePathname();
  const pageCity = CITIES.find((c) => pathname.startsWith(`/locations/${c.slug}`))?.slug;

  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<Saved | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restore a recent conversation the first time the panel opens (only then — later a
  // null chat means the visitor chose "change city" and should see the picker).
  const restored = useRef(false);
  useEffect(() => {
    if (!open || restored.current) return;
    restored.current = true;
    const saved = load();
    setChat(saved ?? (pageCity ? { sessionId: newSessionId(), city: pageCity, messages: [], at: Date.now() } : null));
  }, [open, pageCity]);

  useEffect(() => {
    if (chat) save(chat);
  }, [chat]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [chat?.messages.length, sending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(id); };
  }, [open, chat?.city]);

  function pickCity(slug: string) {
    setChat({ sessionId: newSessionId(), city: slug, messages: [], at: Date.now() });
  }

  /** Back to the city picker (a different city is a different team, so a new chat). */
  function changeCity() {
    setChat(null);
    try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
  }

  function startOver() {
    changeCity();
    if (pageCity) pickCity(pageCity);
  }

  async function send() {
    const text = input.trim();
    if (!text || !chat || sending) return;
    const withUser: Saved = { ...chat, messages: [...chat.messages, { role: "user", text }], at: Date.now() };
    setChat(withUser);
    setInput("");
    setSending(true);
    let answer = t("error");
    try {
      const res = await fetch(`${CHAT_API}/chat/web/${chat.city}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: chat.sessionId, text, locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (typeof data.reply === "string" && data.reply.trim()) answer = data.reply;
    } catch {
      /* network error → the translated fallback */
    }
    setChat({ ...withUser, messages: [...withUser.messages, { role: "assistant", text: answer }], at: Date.now() });
    setSending(false);
  }

  const cityName = CITIES.find((c) => c.slug === chat?.city)?.name;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("open")}
          className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-full bg-espresso py-3 pl-4 pr-5 text-cream shadow-lg transition-colors hover:bg-gold-dark"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M4 5h16v11H8l-4 4V5z" strokeLinejoin="round" />
          </svg>
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.16em]">{t("button")}</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={t("title")}
          className="fixed inset-0 z-[80] flex flex-col bg-cream sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[600px] sm:max-h-[calc(100vh-2.5rem)] sm:w-[380px] sm:rounded-3xl sm:border sm:border-sand sm:shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-sand px-5 py-4">
            <div>
              <p className="font-display text-xl text-espresso">{t("title")}</p>
              {cityName && (
                <button type="button" onClick={changeCity} className="text-xs text-brown-soft underline-offset-2 hover:underline">
                  {cityName} · {t("changeCity")}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              {chat && chat.messages.length > 0 && (
                <button type="button" onClick={startOver} className="rounded-full px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-brown-soft hover:text-espresso">
                  {t("newChat")}
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label={t("close")} className="px-2 text-2xl leading-none text-brown-soft hover:text-espresso">
                ×
              </button>
            </div>
          </div>

          {/* Messages / city picker */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            <Bubble role="assistant">{t("greeting")}</Bubble>
            {!chat ? (
              <div className="space-y-2 pt-1">
                <p className="px-1 text-sm text-brown">{t("pickCity")}</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => pickCity(c.slug)}
                      className="rounded-full border border-espresso/25 px-4 py-2 text-sm text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chat.messages.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  <RichText text={m.text} />
                </Bubble>
              ))
            )}
            {sending && (
              <Bubble role="assistant">
                <span className="inline-flex gap-1" aria-label={t("typing")}>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brown-soft" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brown-soft [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brown-soft [animation-delay:240ms]" />
                </span>
              </Bubble>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-sand px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                rows={1}
                maxLength={800}
                disabled={!chat}
                placeholder={chat ? t("placeholder") : t("pickCityFirst")}
                aria-label={t("placeholder")}
                className="max-h-28 min-h-[44px] flex-1 resize-none rounded-2xl border border-sand bg-ivory px-4 py-2.5 text-base text-espresso sm:text-sm placeholder:text-brown-soft focus:border-gold-dark focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!chat || !input.trim() || sending}
                aria-label={t("send")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-espresso text-cream transition-colors hover:bg-gold-dark disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[0.65rem] text-brown-soft">{t("disclaimer")}</p>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ role, children }: { role: Msg["role"]; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          mine ? "rounded-br-md bg-espresso text-cream" : "rounded-bl-md bg-ivory text-espresso"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
