"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  BEHOLD_FEED_ID,
  INSTAGRAM_FALLBACK,
  INSTAGRAM_URL,
} from "@/lib/instagram";
import { MARKETS } from "@/lib/locations";

interface Tile {
  src: string;
  href: string;
  remote: boolean;
}

export default function InstagramFeed() {
  const t = useTranslations("Instagram");

  // Fallback tiles (real salon work, link to the profile) until Behold is set.
  const fallback: Tile[] = INSTAGRAM_FALLBACK.map((src) => ({
    src,
    href: INSTAGRAM_URL,
    remote: false,
  }));
  const [tiles, setTiles] = useState<Tile[]>(fallback);

  useEffect(() => {
    if (!BEHOLD_FEED_ID) return;
    let cancelled = false;
    fetch(`https://feeds.behold.so/${BEHOLD_FEED_ID}`)
      .then((r) => r.json())
      .then((data) => {
        const posts = Array.isArray(data) ? data : data.posts || [];
        const mapped: Tile[] = posts
          .map((p: Record<string, unknown>) => {
            const sizes = p.sizes as
              | { medium?: { mediaUrl?: string } }
              | undefined;
            const src =
              (p.thumbnailUrl as string) ||
              sizes?.medium?.mediaUrl ||
              (p.mediaUrl as string);
            return { src, href: p.permalink as string, remote: true };
          })
          .filter((t: Tile) => t.src && t.href)
          .slice(0, 6);
        if (!cancelled && mapped.length) setTiles(mapped);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="instagram" className="scroll-mt-24 bg-ivory">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-espresso md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-brown leading-relaxed">{t("intro")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((tile, i) => (
            <a
              key={`${tile.src}-${i}`}
              href={tile.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("viewOn")}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-sand"
            >
              {tile.remote ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tile.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  quality={90}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-espresso/0 text-cream opacity-0 transition-all duration-300 group-hover:bg-espresso/35 group-hover:opacity-100">
                <InstagramGlyph />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {MARKETS.filter((m) => m.instagram).map((m) => (
            <a
              key={m.slug}
              href={m.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-gold-dark"
            >
              <InstagramGlyph className="h-4 w-4" />
              {m.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramGlyph({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
