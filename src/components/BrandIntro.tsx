"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * One-time cinematic logo reveal on first load (per session). The brand logo
 * fades/scales in over a cream screen with a gold line, then curtains away.
 * Skipped for repeat visits in the same session and for reduced-motion users.
 */
export default function BrandIntro() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem("lyn-intro")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("lyn-intro", "1");
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase("out"), 1900);
    const t2 = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-cream ${
        phase === "out"
          ? "animate-[intro-fade-out_0.8s_ease-in_forwards]"
          : ""
      }`}
    >
      <Image
        src="/brand/logo-black.png"
        alt=""
        width={373}
        height={578}
        priority
        className="h-40 w-auto animate-[intro-mark_1.1s_cubic-bezier(0.22,1,0.36,1)_both] md:h-52"
      />
      <span className="mt-7 h-px w-24 origin-center animate-[intro-line_1s_0.45s_cubic-bezier(0.22,1,0.36,1)_both] bg-gradient-to-r from-transparent via-gold to-transparent" />
    </div>
  );
}
