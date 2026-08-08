"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const WORDS = [
  { key: "accuracy", src: "/media/advantages/adv1.mp4" },
  { key: "palette", src: "/media/advantages/adv2.mp4" },
  { key: "technique", src: "/media/advantages/adv3.mp4" },
  { key: "details", src: "/media/advantages/adv4.mp4" },
  { key: "sterility", src: "/media/advantages/adv5.mp4" },
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
      className="relative h-[82vh] min-h-[540px] w-full overflow-hidden bg-espresso"
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

      <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/35 to-espresso/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 md:px-8">
        <p className="eyebrow !text-gold">{t("eyebrow")}</p>
        <h2 className="mt-4 font-display text-5xl leading-[1.05] text-cream md:text-7xl">
          {t("title")}
        </h2>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {WORDS.map((w, i) => (
            <button
              key={w.key}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`font-display text-2xl uppercase tracking-wide transition-colors duration-300 md:text-3xl ${
                i === active
                  ? "text-gold"
                  : "text-cream/55 hover:text-cream"
              }`}
            >
              {t(`words.${w.key}`)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
