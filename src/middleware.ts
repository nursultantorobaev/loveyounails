import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// 301-redirect the retired Tilda domains to the main site.
const NEW_SITE = "https://loveyou.club/en";
const OLD_HOSTS = [
  "loveyounailsalon.com",
  "www.loveyounailsalon.com",
  "loveyouny.com",
  "www.loveyouny.com",
  "loveyousantamonica.com",
  "www.loveyousantamonica.com",
];
const HOST_REDIRECTS: Record<string, string> = Object.fromEntries(
  OLD_HOSTS.map((h) => [h, NEW_SITE]),
);

export default function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  const target = HOST_REDIRECTS[host];
  if (target) {
    return NextResponse.redirect(target, 301);
  }
  // One canonical host: www.loveyou.club → loveyou.club (same path), so Google
  // doesn't index two copies of every page.
  if (host === "www.loveyou.club") {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.host = "loveyou.club";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }
  return intlMiddleware(req);
}

export const config = {
  // Match all paths except API, Next internals, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
