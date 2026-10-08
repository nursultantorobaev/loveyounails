"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Opening } from "@/lib/careers";

export const HIRING_EMAIL = "loveyouhires@gmail.com";

type Status = "idle" | "sending" | "sent" | "not_configured" | "file" | "invalid" | "work" | "error";

const MAX_SALONS = 3;

const inputCls =
  "mt-1.5 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-sm text-espresso placeholder:text-brown-soft/70 focus:border-gold-dark focus:outline-none";
const labelCls = "text-[0.68rem] font-medium uppercase tracking-[0.16em] text-brown-soft";

/** Open positions + the application form. "Apply" on a card pre-fills the form. */
export default function CareersBoard({ openings, cities }: { openings: Opening[]; cities: string[] }) {
  const t = useTranslations("Careers");
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [position, setPosition] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [startedAt] = useState(() => Date.now());
  const [mailto, setMailto] = useState("");
  // Recent salons (last 1–3 years): how many rows are shown, and the "no experience yet" opt-out.
  const [salonRows, setSalonRows] = useState(1);
  const [noSalons, setNoSalons] = useState(false);
  const positions = [...new Set(openings.map((o) => o.position))];

  function apply(o: Opening) {
    setPosition(o.position);
    if (cities.includes(o.city)) setCity(o.city);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => formRef.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus(), 500);
  }

  /** Same details as an email draft — used when the form can't send. */
  function mailtoHref(fd: FormData): string {
    const get = (k: string) => String(fd.get(k) ?? "");
    const subject = `Job application: ${get("position") || "General"}${get("city") ? ` (${get("city")})` : ""} — ${get("name")}`;
    const body = [
      `Name: ${get("name")}`, `Email: ${get("email")}`, `Phone: ${get("phone")}`,
      `Position: ${get("position")}`, `City: ${get("city")}`, `Experience: ${get("experience")}`,
      `Portfolio / Instagram: ${get("portfolio")}`, "",
      "Salons worked at (last 1–3 years):",
      ...(get("noSalonExperience")
        ? ["- No salon experience yet"]
        : Array.from({ length: MAX_SALONS }, (_, i) => [get(`work_${i}_salon`), get(`work_${i}_address`), get(`work_${i}_period`)])
            .filter(([n]) => n)
            .map(([n, a, p]) => `- ${n}, ${a}${p ? ` (${p})` : ""}`)),
      "", get("message"), "", "(Please attach your résumé)",
    ].join("\n");
    return `mailto:${HIRING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("resume");
    if (file instanceof File && file.size > 4 * 1024 * 1024) {
      setStatus("file");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/careers", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) setStatus("sent");
      else if (data.error === "not_configured") { setMailto(mailtoHref(fd)); setStatus("not_configured"); }
      else if (data.error === "file") setStatus("file");
      else if (data.error === "invalid") setStatus("invalid");
      else if (data.error === "work") setStatus("work");
      else { setMailto(mailtoHref(fd)); setStatus("error"); }
    } catch {
      setMailto(mailtoHref(fd));
      setStatus("error");
    }
  }

  return (
    <>
      {/* Openings */}
      <section className="mt-14">
        <h2 className="text-3xl text-espresso md:text-4xl">{t("openingsTitle")}</h2>
        {openings.length === 0 ? (
          <p className="mt-4 max-w-2xl text-brown leading-relaxed">{t("noOpenings")}</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {openings.map((o, i) => (
              <article key={`${o.position}-${o.city}-${i}`} className="flex flex-col rounded-3xl border border-sand bg-cream p-7">
                <p className="eyebrow">{[o.city, o.studio].filter(Boolean).join(" · ") || t("allCities")}</p>
                <h3 className="mt-2 font-display text-3xl text-espresso">{o.position}</h3>
                {o.type && <p className="mt-1 text-sm italic text-brown-soft">{o.type}</p>}
                {o.description && <p className="mt-3 flex-1 text-sm leading-relaxed text-brown">{o.description}</p>}
                <button
                  type="button"
                  onClick={() => apply(o)}
                  className="mt-6 inline-flex w-fit items-center rounded-full bg-espresso px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-gold-dark"
                >
                  {t("apply")}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Application form */}
      <section className="mt-20">
        <form
          ref={formRef}
          id="apply"
          onSubmit={onSubmit}
          className="scroll-mt-28 rounded-3xl border border-sand bg-ivory p-6 md:p-10"
          encType="multipart/form-data"
        >
          <h2 className="text-3xl text-espresso md:text-4xl">{t("formTitle")}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brown">{t("formIntro", { email: HIRING_EMAIL })}</p>

          {status === "sent" ? (
            <div className="mt-8 rounded-2xl bg-cream p-6 text-espresso" role="status">
              <p className="font-display text-2xl">{t("sentTitle")}</p>
              <p className="mt-2 text-sm text-brown">{t("sentBody")}</p>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>{t("fields.name")} *</span>
                  <input name="name" required maxLength={120} autoComplete="name" className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>{t("fields.email")} *</span>
                  <input name="email" type="email" required maxLength={200} autoComplete="email" className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>{t("fields.phone")}</span>
                  <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>{t("fields.position")} *</span>
                  <select name="position" required value={position} onChange={(e) => setPosition(e.target.value)} className={inputCls}>
                    <option value="" disabled>{t("choose")}</option>
                    {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                    <option value="General application">{t("general")}</option>
                  </select>
                </label>
                <label className="block">
                  <span className={labelCls}>{t("fields.city")}</span>
                  <select name="city" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
                    <option value="">{t("anyCity")}</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelCls}>{t("fields.experience")}</span>
                  <select name="experience" defaultValue="" className={inputCls}>
                    <option value="">—</option>
                    {(["lt1", "y1_3", "y3_5", "y5"] as const).map((k) => (
                      <option key={k} value={t(`experience.${k}`)}>{t(`experience.${k}`)}</option>
                    ))}
                  </select>
                </label>
                {/* Recent salons — where they worked in the last 1–3 years */}
                <fieldset className="md:col-span-2 rounded-2xl border border-sand bg-cream/60 p-5">
                  <legend className="px-1 text-sm font-medium text-espresso">{t("work.title")}{!noSalons && " *"}</legend>
                  <p className="text-xs text-brown-soft">{t("work.hint")}</p>
                  {!noSalons && (
                    <div className="mt-3 space-y-4">
                      {Array.from({ length: salonRows }, (_, i) => (
                        <div key={i} className="grid gap-3 md:grid-cols-[1.1fr_1.4fr_0.8fr_auto] md:items-end">
                          <label className="block">
                            <span className={labelCls}>{t("work.salon")}{i === 0 && " *"}</span>
                            <input name={`work_${i}_salon`} required={i === 0} maxLength={120} className={inputCls} />
                          </label>
                          <label className="block">
                            <span className={labelCls}>{t("work.address")}{i === 0 && " *"}</span>
                            <input name={`work_${i}_address`} required={i === 0} maxLength={200} placeholder={t("work.addressPlaceholder")} className={inputCls} />
                          </label>
                          <label className="block">
                            <span className={labelCls}>{t("work.period")}</span>
                            <input name={`work_${i}_period`} maxLength={40} placeholder="2023 – 2025" className={inputCls} />
                          </label>
                          {i > 0 && i === salonRows - 1 ? (
                            <button
                              type="button"
                              onClick={() => setSalonRows((n) => n - 1)}
                              aria-label={t("work.remove")}
                              className="h-[46px] px-2 text-xl leading-none text-brown-soft hover:text-espresso"
                            >
                              ×
                            </button>
                          ) : (
                            <span className="hidden md:block md:w-[30px]" />
                          )}
                        </div>
                      ))}
                      {salonRows < MAX_SALONS && (
                        <button
                          type="button"
                          onClick={() => setSalonRows((n) => n + 1)}
                          className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-gold-dark hover:text-espresso"
                        >
                          + {t("work.add")}
                        </button>
                      )}
                    </div>
                  )}
                  <label className="mt-4 flex items-center gap-2 text-sm text-brown">
                    <input
                      type="checkbox"
                      name="noSalonExperience"
                      checked={noSalons}
                      onChange={(e) => setNoSalons(e.target.checked)}
                      className="h-4 w-4 accent-[var(--color-gold-dark)]"
                    />
                    {t("work.none")}
                  </label>
                </fieldset>
                <label className="block md:col-span-2">
                  <span className={labelCls}>{t("fields.portfolio")}</span>
                  <input name="portfolio" maxLength={300} placeholder="@yourinstagram / https://…" className={inputCls} />
                </label>
                <label className="block md:col-span-2">
                  <span className={labelCls}>{t("fields.message")}</span>
                  <textarea name="message" rows={4} maxLength={3000} className={inputCls} />
                </label>
                <label className="block md:col-span-2">
                  <span className={labelCls}>{t("fields.resume")}</span>
                  <input
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.heic"
                    className="mt-1.5 block w-full text-sm text-brown file:mr-4 file:rounded-full file:border-0 file:bg-espresso file:px-5 file:py-2.5 file:text-[0.68rem] file:uppercase file:tracking-[0.14em] file:text-cream"
                  />
                  <span className="mt-1 block text-xs text-brown-soft">{t("resumeHint")}</span>
                </label>
              </div>

              {/* Spam traps */}
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <input type="hidden" name="startedAt" value={startedAt} />
              <input type="hidden" name="locale" value={locale} />

              {status !== "idle" && status !== "sending" && (
                <div className="mt-6 rounded-2xl border border-gold/50 bg-cream p-4 text-sm text-espresso" role="alert">
                  {status === "file" ? t("errors.file") : status === "invalid" ? t("errors.invalid") : status === "work" ? t("errors.work") : t("errors.send", { email: HIRING_EMAIL })}{" "}
                  {(status === "not_configured" || status === "error") && (
                    <a href={mailto} className="font-medium text-gold-dark underline underline-offset-4">
                      {t("emailUs")}
                    </a>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-espresso px-8 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
              >
                {status === "sending" ? t("sending") : t("submit")}
              </button>
            </>
          )}
        </form>
      </section>
    </>
  );
}
