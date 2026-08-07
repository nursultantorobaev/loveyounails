"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MARKETS } from "@/lib/locations";

interface Stat {
  value: number;
  decimals: number;
  suffix?: string;
  labelKey: "clients" | "studios" | "rating";
}

// Studios derived from the data (always accurate). Other figures are marketing.
const STUDIO_COUNT = MARKETS.reduce((n, m) => n + m.salons.length, 0);

const STATS: Stat[] = [
  { value: 25, decimals: 0, suffix: "K+", labelKey: "clients" },
  { value: STUDIO_COUNT, decimals: 0, labelKey: "studios" },
  { value: 4.9, decimals: 1, suffix: "★", labelKey: "rating" },
];

function useCountUp(target: number, decimals: number, duration = 1600) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }
    let started = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setValue(target * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setValue(target);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, decimals, duration]);

  return { ref, display: value.toFixed(decimals) };
}

function StatItem({ stat, label }: { stat: Stat; label: string }) {
  const { ref, display } = useCountUp(stat.value, stat.decimals);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl leading-none text-espresso md:text-6xl">
        {display}
        {stat.suffix && (
          <span className="text-gold-dark">{stat.suffix}</span>
        )}
      </div>
      <div className="mt-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-brown-soft">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const t = useTranslations("Stats");
  return (
    <section className="bg-ivory">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 sm:grid-cols-3 sm:divide-x sm:divide-sand md:px-8 md:py-20">
        {STATS.map((s) => (
          <StatItem key={s.labelKey} stat={s} label={t(s.labelKey)} />
        ))}
      </div>
    </section>
  );
}
