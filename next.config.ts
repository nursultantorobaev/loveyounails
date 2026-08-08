import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray package-lock.json in the home directory
  // doesn't confuse Turbopack/Next during build.
  turbopack: {
    root: __dirname,
  },
  images: {
    // AVIF (then WebP) — noticeably crisper than the default at the same weight.
    formats: ["image/avif", "image/webp"],
    // Allow a higher-quality setting for photography.
    qualities: [75, 90],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
