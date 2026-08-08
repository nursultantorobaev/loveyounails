"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Image with a subtle scroll parallax (slides within its frame) and a gentle
 * hover zoom. Honors prefers-reduced-motion.
 */
export default function ParallaxImage({
  src,
  alt,
  className = "",
  rounded = "rounded-3xl",
  sizes = "(max-width: 768px) 100vw, 50vw",
  speed = 6,
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
  sizes?: string;
  speed?: number;
}) {
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inner.current;
    const frame = el?.parentElement;
    if (!el || !frame) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.transform = `translate3d(0, ${(-clamped * speed).toFixed(2)}%, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div className={`group relative w-full overflow-hidden ${rounded} ${className}`}>
      <div
        ref={inner}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: "-8%", bottom: "-8%" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      </div>
    </div>
  );
}
