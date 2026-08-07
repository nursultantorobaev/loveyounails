import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray package-lock.json in the home directory
  // doesn't confuse Turbopack/Next during build.
  turbopack: {
    root: __dirname,
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
