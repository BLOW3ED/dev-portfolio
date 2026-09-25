import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English lives at `/`, Spanish at `/es`.
  localePrefix: "as-needed",
  // The URL is the single source of truth for the language: no
  // Accept-Language redirects and no locale cookie (the site sets no cookies).
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
