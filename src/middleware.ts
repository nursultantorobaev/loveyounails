import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// 301-redirect the retired Tilda domains to the matching page on loveyou.club.
const HOST_REDIRECTS: Record<string, string> = {
  "loveyounailsalon.com": "https://loveyou.club/en/locations/chicago",
  "www.loveyounailsalon.com": "https://loveyou.club/en/locations/chicago",
  "loveyouny.com": "https://loveyou.club/en/locations/new-york",
  "www.loveyouny.com": "https://loveyou.club/en/locations/new-york",
  "loveyousantamonica.com": "https://loveyou.club/en/locations/santa-monica",
  "www.loveyousantamonica.com": "https://loveyou.club/en/locations/santa-monica",
};

export default function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  const target = HOST_REDIRECTS[host];
  if (target) {
    return NextResponse.redirect(target, 301);
  }
  return intlMiddleware(req);
}

export const config = {
  // Match all paths except API, Next internals, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
