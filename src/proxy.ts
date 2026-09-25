import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next internals, Vercel internals, generated OG images (their URLs
  // already carry the locale) and anything with a file extension
  // (sitemap.xml, robots.txt, images…).
  matcher: "/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)",
};
