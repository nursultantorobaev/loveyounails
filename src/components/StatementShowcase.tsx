"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Full-bleed statement band with a cross-fading, slowly-zooming showcase of
 * real work behind the text. Auto-advances, pauses on hover, and has clickable
 * dots. Honors prefers-reduced-motion (no auto-advance / no zoom).
 */
export default function StatementShowcase({
  images,
  interval = 4500,
  children,
}: {
  images: { src: string; alt: string }[];
  interval?: number;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      if (!paused.current) setActive((p) => (p + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <section
      className="relative h-[56vh] min-h-[360px] max-h-[560px] w-full overflow-hidden bg-espresso"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <Image
            src={img.src}
            alt={i === active ? img.alt : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className="ken-burns object-cover"
          />
        </div>
      ))}

      {/* scrim for legibility */}
      <div className="absolute inset-0 bg-espresso/40" />

      {/* statement */}
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        {children}
      </div>

      {/* dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${img.alt}`}
            aria-current={i === active}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-7 bg-cream" : "w-1.5 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
