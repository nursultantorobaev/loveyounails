"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Sterility leads (client request) and opens the full sterilization page when tapped.
const WORDS = [
  { key: "sterility", src: "/media/sterilization/sterilization.mp4", href: "/sterilization" },
  { key: "accuracy", src: "/media/advantages/adv1.mp4" },
  { key: "palette", src: "/media/advantages/adv2.mp4" },
  { key: "technique", src: "/media/advantages/adv3.mp4" },
  { key: "details", src: "/media/advantages/adv4.mp4" },
  { key: "manicure", src: "/media/advantages/adv6.mp4" },
] as const;

export default function AdvantagesVideo() {
  const t = useTranslations("BestSalon");
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const paused = useRef(false);

  // Only engage when the section is on screen (perf: don't load/play offscreen).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Play the active clip, pause the rest.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && visible) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, visible]);

  // Auto-advance while idle + on screen.
  useEffect(() => {
    if (
      !visible ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      if (!paused.current) setActive((p) => (p + 1) % WORDS.length);
    }, 4000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="advantages"
      className="relative h-[82vh] min-h-[540px] w-full scroll-mt-20 overflow-hidden bg-espresso"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {WORDS.map((w, i) => (
        <video
          key={w.key}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          src={visible ? w.src : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden={i !== active}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/55 to-espresso/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 md:px-8">
        <p className="eyebrow !text-gold [text-shadow:0_1px_12px_rgba(0,0,0,0.75)]">
          {t("eyebrow")}
        </p>
        <h2 className="mt-4 font-display text-5xl uppercase leading-[1.05] text-cream md:text-7xl">
          {t("title")}
        </h2>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {WORDS.map((w, i) => {
            const cls = `font-display text-2xl uppercase tracking-wide transition-colors duration-300 md:text-3xl ${
              i === active ? "text-gold" : "text-cream/55 hover:text-cream"
            }`;
            return "href" in w ? (
              <Link
                key={w.key}
                href={w.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`${cls} underline decoration-gold/60 decoration-1 underline-offset-8`}
              >
                {t(`words.${w.key}`)}
              </Link>
            ) : (
              <button
                key={w.key}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={cls}
              >
                {t(`words.${w.key}`)}
              </button>
            );
          })}
        </div>
        <Link
          href="/sterilization"
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-cream/50 px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-espresso"
        >
          {t("sterilityCta")} →
        </Link>
      </div>
    </section>
  );
}
