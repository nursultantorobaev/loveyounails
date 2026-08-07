import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray package-lock.json in the home directory
  // doesn't confuse Turbopack/Next during build.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
